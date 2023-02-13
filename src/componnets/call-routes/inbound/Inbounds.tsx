import React, { useState, useEffect } from "react";
import { Col, Dropdown, Row } from "react-bootstrap";
import { BuildingGear, Diagram2, Gear, PencilSquare, PlusLg, Trash } from "react-bootstrap-icons";
import GridView, { IColumns, IGridViewState } from "../../grid-view/GridView";
import PlineTools, { TypeAlert } from "../../services/PlineTools";
import ModalCustom from "../../reuseables/modal/ModalCustom";
import AddPattern from "../AddPattern/AddPattern";
import AddTrunks from "../AddTrunk/AddTrunks";
import InBoundsForm from "./InboundsForm";


const GlobalOutbounds = () => {
    //Define Grird Hooks
    const [searchParams, setSearchParams] = useState<any>();
    const [sortParams, setSortParams] = useState<string>();
    //Modal Hooks
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modaltype, setmodalType] = useState({});
    const [sizeModal, setSizeModal] = useState("")
    //Data State
    const [state, setState] = useState<IGridViewState>({
        content: [],
        pageable: {
            offset: 0,
            pageNumber: 0,
            pageSize: 0,
            totalElements: 0,
            totalPages: 0,
        },
        totalPages: 0,
        totalElements: 0,
        size: 0,
    });

    //Grid Options
    const pageSize = 10;
    const columns: IColumns[] = [
        {
            label: "Row",
            id: "#",
            search: false,
        },
        {
            label: "Name",
            id: "name",
            search: true,
            sort: true,
        },
        {
            label: "Sequential",
            id: "sequential",

        },
        {
            label: "Pattern",
            id: "id",
            value: (value: Object) => {
                return (
                    <p
                        className="edit"
                        onClick={() => {
                            EditPattern(value)
                        }}
                    >
                        <Diagram2 color="green" size={20} />
                    </p>
                );
            },
        },
        {
            label: "Trunks",
            id: "id",
            value: (value: Object) => {
                return (
                    <p
                        className="edit"
                        onClick={() => {
                            EditTrunk(value);
                        }}
                    >
                        <BuildingGear color="black" size={18} />
                    </p>
                );
            },
        },
        {
            label: "Edit",
            id: "id",
            value: (value: Object) => {
                return (
                    <p
                        className="edit"
                        onClick={() => {
                            Edit(value);
                        }}
                    >
                        <PencilSquare size={18} />
                    </p>
                );
            },
        },
        {
            label: "Delete",
            id: "id",
            value: (value: string) => {
                return (
                    <p
                        className="delete"
                        onClick={() => {
                            Delete(value);
                        }}
                    >
                        <Trash size={18} />
                    </p>
                );
            },
        },
    ];
    //get dataGrid Data
    const getData = (page = 0, size = pageSize) => {
        const searchUrl = new URLSearchParams(searchParams).toString();

        let sort = "";
        if (sortParams !== undefined) {
            sort = "sort=" + sortParams;
        }
        PlineTools.getRequest(
            `/outbound-routes/?page=${page}&size=${size}&${searchUrl}&${sort}`)
            .then((data) => {
                setState(data.data);
            })
            .catch((error) => {
                PlineTools.errorDialogMessage(
                    "An error occurred while executing your request. Contact the system administrator\n" +
                    error
                );
            });
    };
    //Gird options functions
    const Delete = (id: string) => {
        if (window.confirm("Are you sure you want to delete this Profile?")) {
            PlineTools.deleteRequest("/outbound-routes/", id).then((result) => {
                if (result.data.hasError) {
                    PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
                } else {
                    getData();
                }
            });
        }
    };

    const Edit = (id: Object) => {
        setSizeModal("lg");
        setModalIsOpen(true);
        setmodalType(< InBoundsForm id={id} modal={setModalIsOpen} reload={reload} />);
    };
    const EditPattern = (id: Object) => {
        setSizeModal("xl");
        setModalIsOpen(true);
        setmodalType(<AddPattern id={id} modal={setModalIsOpen} size={"xl"} reload={reload} />)
    }
    const EditTrunk = (id: object) => {
        setModalIsOpen(true);
        setmodalType(<AddTrunks id={id} modal={setModalIsOpen} reload={reload} />)
    }
    const reload = () => {
        getData();
    }
    useEffect(() => {
        getData();
        return () => { };
    }, [searchParams, sortParams]);

    const search = (f: string, v: string) => {
        let tmp = { ...searchParams };
        tmp[f] = v;
        setSearchParams(tmp);
    };

    const sort = (f: string) => {
        setSortParams(f);
    };

    return (
        <div>
            <Row>
                <ModalCustom size={sizeModal} show={modalIsOpen} onHide={() => setModalIsOpen(false)}>
                    {modaltype}
                </ModalCustom>
                <Col>
                    <Dropdown>
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            OPTIONS
                            &nbsp;
                            <Gear />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => {
                                    setModalIsOpen(true);
                                    setmodalType(<InBoundsForm modal={setModalIsOpen} reload={() => reload()} />)
                                }}
                            ><PlusLg size={15} />New Route </Dropdown.Item>

                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <hr />
            <Row>
                <Col>
                    <h4>List of Global Outbound Routes</h4>
                </Col>
            </Row>
            <Row>
                <Col>
                    <GridView
                        Columns={columns}
                        Data={state.content}
                        Events={{
                            first: () => {
                                getData(0);
                            },
                            pre: () => {
                                if (state.pageable.pageNumber - 1 >= 0)
                                    getData(state.pageable.pageNumber - 1);
                            },
                            next: () => {
                                if (state.totalPages > state.pageable.pageNumber + 1)
                                    getData(state.pageable.pageNumber + 1);
                            },
                            last: () => {
                                getData(state.totalPages - 1);
                            },
                        }}
                        Pagination={{
                            totalElements: state.totalElements,
                            totalPages: state.totalPages,
                            pageSize: state.pageable.pageSize,
                            offset: state.pageable.offset,
                            pageNumber: state.pageable.pageNumber,
                        }}
                        SearchEvent={search}
                        SortEvent={sort}
                    />
                </Col>
            </Row>
        </div>
    );
};

export default GlobalOutbounds;
