import React, { useEffect, useMemo, useState } from 'react'
import DataGrid from '../../grid-view/DataGrid/DataGrid'
import {
    PencilSquare,
    PlusLg,
    Trash,
    Trash3Fill
} from 'react-bootstrap-icons';
import PlineTools, { TypeAlert } from '../../services/PlineTools';
import ModalCustom from '../../reuseables/modal/ModalCustom';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import AddGroupUsersForm from '../add-group-users/AddGroupUsersForm';

const SipUsers = () => {
    const navigate = useNavigate();
    const [overlay, setOverlay] = useState(false);
    const gridStyle = useMemo(() => ({ height: 600, width: '100%' }), []);
    const [rowData, setRowData] = useState<any>([]);
    //Modal Hooks
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modaltype, setmodalType] = useState({});
    const [sizeModal, setSizeModal] = useState("")
    const saveChanges = (data: any) => {
        let url = "/sip-users";
        PlineTools.patchRequest(url, data)
            .then((result) => {
                if (result.data.hasError) {
                    PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
                } else {
                    reload();
                }
            })
            .catch((error) => {
                PlineTools.errorDialogMessage("An error occurred while executing your request. Contact the system administrator");
            });
    }
    const getData = (page = 0, size = 99999) => {
        setOverlay(true);
        PlineTools.getRequest(
            `/sip-users/?page=${page}&size=${size}`)
            .then((data) => {
                setRowData(data.data.content);
            })
            .catch((error) => {
                PlineTools.errorDialogMessage(
                    "An error occurred while executing your request. Contact the system administrator\n" +
                    error
                );
            });
    };
    useEffect(() => {
        getData()
    }, [])
    const reload = () => {
        getData();
    }

    function CheckBox(params: any) {
        return <input style={{ cursor: "pointer" }} type="checkbox" checked={params.value} onChange={(e: any) => {
            const value = e.target.checked;
            let colId = params.column.colId;
            params.node.setDataValue(colId, value);
            saveChanges(params.node.data)
        }} />
    }

    const Edit = (params: any) => {
        let id = params.node.data.id;
        return <p style={{ cursor: "pointer" }} onClick={() => {
            navigate("/sip-users/edit/" + id);
        }}><PencilSquare color="green" size={17} /></p>
    }
    function DeleteRow(e: any) {
        return <p style={{ cursor: "pointer" }} onClick={
            () => {

                if (window.confirm("Are you sure you want to delete this Profile?")) {
                    e.api.applyTransaction({
                        remove: [e.node.data],
                    });
                    PlineTools.deleteRequest("/sip-users/", e.node.data.id).then((result) => {
                        if (result.data.hasError) {
                            PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
                        } else {

                            getData();
                        }
                    });
                }
            }
        }>
            <Trash3Fill color="red" /></p>
    }

    const columns = [
        { field: 'row', valueGetter: "node.rowIndex + 1", headerName: 'Row', width: 60 },
        { field: 'uid', headerName: 'User', width: 120 },

        { field: 'sipProfile.name', headerName: 'Sip Profile' },
        { field: 'sipUserGroup.name', headerName: 'Group' },
        {
            field: 'enable', headerName: 'Enable', width: 30, cellRenderer: CheckBox,
        },
        { field: 'edit', headerName: 'Edit', cellRenderer: Edit, filter: false, sortable: false },
        { field: 'delete', headerName: 'Delete', cellRenderer: DeleteRow, filter: false, sortable: false },

    ];
    return (
        <div style={{ width: '100%', height: '100%' }} >
            <Row>
                <ModalCustom size={sizeModal} show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
                    {modaltype}
                </ModalCustom>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle style={{ background: "#1B9CFC", border: "none" }} id="dropdown-basic">
                            Add Users
                            &nbsp;
                            <PlusLg size={17} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => {
                                    navigate("/sip-users/create");
                                }}
                            ><PlusLg size={15} />New User </Dropdown.Item>
                            <Dropdown.Item
                                onClick={() => {
                                    setSizeModal("lg");
                                    setModalIsOpen(true);
                                    setmodalType(<AddGroupUsersForm modal={setModalIsOpen} reload={() => reload()} />)
                                }}
                            ><PlusLg size={15} />Bulk Addition</Dropdown.Item>
                               <Dropdown.Item
                                onClick={() => {
                                    navigate("/sip-users-bulk-delete/index");
                                }}
                            ><Trash size={15} />Bulk Delete</Dropdown.Item>
                               <Dropdown.Item
                                onClick={() => {
                                    navigate("/sip-users-bulk-edit/index");
                                }}
                            ><PencilSquare size={15} />Bulk Edit</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <br />
            <DataGrid
                gridRef
                overlay={overlay}
                dnd={false}
                paging={true}
                style={gridStyle}
                columnDefs={columns}
                rowData={rowData}
            />
        </div >
    )
}

export default SipUsers