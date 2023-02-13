import React, { useEffect, useMemo, useState } from "react";
import DataGrid from "../../grid-view/DataGrid/DataGrid";
import SipTrunkForm from "./SipTrunkForm";
import { Gear, PencilFill, PencilSquare, PlusLg, Trash3Fill } from "react-bootstrap-icons";
import PlineTools, { TypeAlert } from "../../services/PlineTools";
import ModalCustom from "../../reuseables/modal/ModalCustom";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { useNavigate } from "react-router";

const SipTrunks = () => {
  const navigate = useNavigate();
  const gridStyle = useMemo(() => ({ height: 600, width: "100%" }), []);
  const [rowData, setRowData] = useState<any>([]);

  const saveChanges = (data: any) => {
    let url = "/sip-trunks";
    PlineTools.patchRequest(url, data)
      .then((result) => {
        if (result.data.hasError) {
          PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
        } else {
          reload();
        }
      })
      .catch((error) => {
        PlineTools.errorDialogMessage(
          "An error occurred while executing your request. Contact the system administrator"
        );
      });
  };
  const getData = (page = 0, size = 99999) => {
    PlineTools.getRequest(`/sip-trunks/?page=${page}&size=${size}`)
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
    getData();
  }, []);
  const reload = () => {
    getData();
  };

  function CheckBox(params: any) {
    return (
      <input
        style={{ cursor: "pointer" }}
        type="checkbox"
        checked={params.value}
        onChange={(e: any) => {
          const value = e.target.checked;
          let colId = params.column.colId;
          params.node.setDataValue(colId, value);
          saveChanges(params.node.data);
        }}
      />
    );
  }

  const Edit = (params: any) => {
    let id = params.node.data.id;
    return (
      <p
        style={{ cursor: "pointer" }}
        onClick={() => {
          navigate("/sip-trunks/edit/" + id);
        }}
      >
        <PencilSquare color="green" size={17} />
      </p>
    );
  };
  function DeleteRow(e: any) {
    return (
      <p
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (window.confirm("Are you sure you want to delete this Profile?")) {
            e.api.applyTransaction({
              remove: [e.node.data],
            });
            PlineTools.deleteRequest("/sip-trunks/", e.node.data.id).then(
              (result) => {
                if (result.data.hasError) {
                  PlineTools.showAlert(result.data.messages, TypeAlert.Danger);
                } else {
                  getData();
                }
              }
            );
          }
        }}
      >
        <Trash3Fill color="red" />
      </p>
    );
  }

  const columns = [
    { field: "row", valueGetter: "node.rowIndex + 1", headerName: "Row" },
    { field: "name", headerName: "Name", width: 80 },

    { field: "sipProfile.name", headerName: "Profile" },
    { field: "username", headerName: "UserName" },
    {
      field: "enable",
      headerName: "Enable",
      width: 30,
      cellRenderer: CheckBox,
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 30,
      cellRenderer: Edit,
      filter: false,
      sortable: false,
    },
    {
      field: "delete",
      headerName: "Delete",
      width: 30,
      cellRenderer: DeleteRow,
      filter: false,
      sortable: false,
    },
  ];
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Row>
        <Col>
          <Button style={{ background: "#1B9CFC", border: "none" }} onClick={() => {
            navigate("/sip-trunks/create");
          }}>Add Trunk <PlusLg size={18} /></Button>
        </Col>
      </Row>
      <br />
      <DataGrid
        dnd={false}
        paging={true}
        style={gridStyle}
        columnDefs={columns}
        rowData={rowData}
      />
    </div>
  );
};

export default SipTrunks;
