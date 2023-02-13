import React, { useEffect, useMemo, useState } from 'react'
import DataGrid from '../../grid-view/DataGrid/DataGrid'
import {
    PencilSquare,
    PlusLg,
    Trash3Fill
} from 'react-bootstrap-icons';
import PlineTools, { TypeAlert } from '../../services/PlineTools';
import ModalCustom from '../../reuseables/modal/ModalCustom';
import { Button, Col, Row } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';


const SipGroupUsers = () => {
    const navigate = useNavigate();
    const gridStyle = useMemo(() => ({ height: 600, width: '100%' }), []);
    const [rowData, setRowData] = useState<any>([]);
    //Modal Hooks
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modaltype, setmodalType] = useState({});
    const [sizeModal, setSizeModal] = useState("")
    const saveChanges = (data: any) => {
        let url = "/sip-group-users";
        console.log(data);
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

        PlineTools.getRequest(
            `/sip-group-users/?page=${page}&size=${size}`)
            .then((data) => {
                console.log(data.data.content);
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
            navigate("/sip-group-users/edit/" + id);
        }}><PencilSquare color="green" size={17} /></p>
    }
    function DeleteRow(e: any) {
        return <p style={{ cursor: "pointer" }} onClick={
            () => {

                if (window.confirm("Are you sure you want to delete this Profile?")) {
                    e.api.applyTransaction({
                        remove: [e.node.data],
                    });
                    PlineTools.deleteRequest("/sip-group-users/", e.node.data.id).then((result) => {
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
        { field: 'row', valueGetter: "node.rowIndex + 1", headerName: 'Row' },
        { field: 'name', headerName: 'Name', width: 80 },

        {
            field: 'enable', headerName: 'Enable', width: 30, cellRenderer: CheckBox,
        },
        { field: 'edit', headerName: 'Edit', width: 30, cellRenderer: Edit, filter: false, sortable: false },
        { field: 'delete', headerName: 'Delete', width: 30, cellRenderer: DeleteRow, filter: false, sortable: false },

    ];
    return (
        <div style={{ width: '100%', height: '100%' }} >
            <Row>
                <ModalCustom size={sizeModal} show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
                    {modaltype}
                </ModalCustom>
                <Col>
                    <Button style={{ background: "#1B9CFC", border: "none" }} className='btn-grid' onClick={() => {
                        navigate("/sip-group-users/create");
                    }}>Add Sip Group <PlusLg size={18} /></Button>
                </Col>
            </Row>
            <br />
            <DataGrid
                paging={true}
                dnd={false}
                style={gridStyle}
                columnDefs={columns}
                rowData={rowData}
            />
        </div>
    )
}

export default SipGroupUsers