import React, { useMemo, useRef } from 'react'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import './style.css';
import { AgGridReact } from 'ag-grid-react';
import './Overlay.css'
import Overlay from './Overlay';



const DataGrid = (props: any) => {

    const gridRef = useRef<AgGridReact>(null);
    const defaultColDef = useMemo(() => {
        return {
            sortable: true,
            filter: true,
            flex: 1,

        };
    }, []);
    const gridOptions = {
        suppressMenuHide: true
    }
    const loadingOverlayComponent = useMemo(() => {
        return Overlay;
    }, []);
    function Loading() {
        gridRef.current?.api.showLoadingOverlay()
    }
    function hideLoading() {
        gridRef.current?.api.hideOverlay()
    }
    return (
        <div className="ag-theme-alpine" style={props.style}>
            <AgGridReact
                ref={gridRef}
                gridOptions={gridOptions}
                onRowDragEnd={props.dragSort}
                rowData={props.rowData}
                defaultColDef={defaultColDef}
                loadingOverlayComponent={loadingOverlayComponent}
                rowDragManaged={props.dnd}
                pagination={props.paging}
                paginationPageSize={props.pageSize}
                columnDefs={props.columnDefs}>
            </AgGridReact>
        </div>
    )
}
DataGrid.defaultProps = {
    style: {
        height: 300, width: '100%'
    },
    paging: false,//pagination
    pageSize: 15
}
export default DataGrid