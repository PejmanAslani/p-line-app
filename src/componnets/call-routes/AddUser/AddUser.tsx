import React, { useEffect, useState } from "react";

import { Button, Form, Row } from "react-bootstrap";
import { Col } from "react-bootstrap";
import ToolTipCustom from "../../reuseables/tooltip/ToolTipCustom";
import PlineTools, { TypeAlert } from "../../services/PlineTools";
import DataGrid from "../../grid-view/DataGrid/DataGrid";
import { Trash3Fill } from "react-bootstrap-icons";

const AddUser = (props: any) => {
  //Define Hooks
  const [rowData, setRowData] = useState<any>([]);
  const [options, setOptions] = useState({
    Users: [],
    Groups: [],
  });
  //Define FormData State
  const [state, setState] = useState({
    id: null,
    sipUser: {
      id: 0,
    },
    outboundRoute: {
      id: 0,
    },
    enable: false,
  });

  const GetUsers = () => {
    PlineTools.getRequest("/sip-users").then((result) => {
      if (result.data.hasError) {
        PlineTools.errorDialogMessage("Filed To Get Users");
      } else {
        setOptions({ ...options, Users: result.data.content });
      }
    });
  };
  const GetUserGroups = () => {
    PlineTools.getRequest("/sip-group-users").then((result) => {
      if (result.data.hasError) {
        PlineTools.errorDialogMessage("Filed To Get Sip UserGroups");
      } else {
        setOptions({ ...options, Groups: result.data.content });
      }
    });
  };
  const AddUser = (e: any) => {
    e.preventDefault();
    let url = props.urlUser + props.id;
    var data: any[] = [state].concat(rowData);
    PlineTools.postRequest(url, data)
      .then((result: any) => {
        if (result.data.hasError) {
          PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
        } else {
          props.reload();
          getData();
        }
      })
      .catch((error: any) => {
        PlineTools.errorDialogMessage(
          "An error occurred while executing your request. Contact the system administrator"
        );
      });
  };
  const getData = () => {
    const id = props.id;
    PlineTools.getRequest("/outbound-route-users/" + id)
      .then((result: any) => {
        const lengh = result.data.length;
        for (let i = 0; i <= lengh; i++) {
          setRowData(result.data);
        }
      })
      .catch(() => {
        PlineTools.errorDialogMessage(
          "An error occurred while executing your request. Contact the system administrator"
        );
      });
  };
  const saveChanges = (data: any) => {
    let RouteID = props.id;
    setState({ ...state, outboundRoute: { id: RouteID } });
    let url = "/outbound-route-users/" + RouteID;
    PlineTools.postRequest(url, data)
      .then((result) => {
        if (result.data.hasError) {
          PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
        } else {
          props.reload();
        }
      })
      .catch((error) => {
        PlineTools.errorDialogMessage(
          "An error occurred while executing your request. Contact the system administrator"
        );
      });
  };
  useEffect(() => {
    getData();
    setState({ ...state, outboundRoute: { id: props.id } });
    GetUsers();
  }, []);
  const columns = [
    {
      field: "sipUser.uid",
      headerName: "Sip User",
      rowDrag: true,
    },

    {
      field: "enable",
      headerName: "Enable",
      width: 100,
      cellRenderer: CheckBox,
    },
    { field: "delete", headerName: "Delete", cellRenderer: DeleteRow, filter: false, sortable: false },
  ];
  function CheckBox(params: any) {
    return (
      <input
        style={{ cursor: "pointer" }}
        type="checkbox"
        checked={params.value}
        onChange={(e: any) => {
          let newRowData: any[] = [];
          const value = e.target.checked;
          let colId = params.column.colId;
          params.node.setDataValue(colId, value);
          params.api.forEachNode((node: any) => newRowData.push(node.data));
          saveChanges(newRowData);
        }}
      />
    );
  }
  function returnUser(e: any) {
    return <p>{e.data.sipUser.uid}</p>;
  }
  function DeleteRow(e: any) {
    return (
      <p
        style={{ cursor: "pointer" }}
        onClick={() => {
          let newRowData: any[] = [];
          e.api.applyTransaction({
            remove: [e.node.data],
          });
          e.api.forEachNodeAfterFilter((node: any) =>
            newRowData.push(node.data)
          );
          saveChanges(newRowData);
        }}
      >
        <Trash3Fill color="red" />
      </p>
    );
  }
  const dragSort = (params: any) => {
    let newRowData: any[] = [];
    params.api.forEachNodeAfterFilterAndSort((node: any) =>
      newRowData.push(node.data)
    );
    saveChanges(newRowData);
  };
  return (
    <div className="container">
      <h3> Add Users</h3>
      <hr />
      <Form onSubmit={AddUser}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" controlId="sipTrunks">
              <Form.Label>SIP Users</Form.Label>
              <ToolTipCustom />
              <select
                className={"form-select"}
                value={state.sipUser.id}
                onChange={(e) => {
                  setState({
                    ...state,
                    sipUser: { id: parseInt(e.target.value) },
                  });
                }}
              >
                <option value={0}>Select Users ...</option>
                {options.Users.map((opt: any) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.uid}
                  </option>
                ))}
              </select>
            </Form.Group>
          </Col>
          {/* <Col md={6}>
                        <Form.Group className="mb-3" controlId="sipTrunks">
                            <Form.Label>SIP Groups</Form.Label>
                            <ToolTipCustom />
                            <select
                                className={"form-select"}
                                onChange={(e) => {
                                    setState({ ...state, sipUser: { id: parseInt(e.target.value) } })
                                }}>
                                <option value={0}>Select Users ...</option>
                                {options.Groups.map((opt: any) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </Form.Group>
                    </Col> */}
        </Row>
        <Row>
          <Col md={6}>
            <Button variant="success" type="submit">
              Add User
            </Button>
            {" "}
            <Button variant="danger" onClick={() => { props.modal(false) }}>
              Cancel
            </Button>
          </Col>
        </Row>
      </Form>
      <hr />
      <h3>Users</h3>
      <DataGrid
        dnd={true}
        paging={false}
        dragSort={dragSort}
        columnDefs={columns}
        rowData={rowData}
      />

    </div>
  );
};

export default AddUser;
