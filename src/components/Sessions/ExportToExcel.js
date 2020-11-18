import React, {useEffect, useState} from 'react';
import {getModelSessionsForSession} from "../../services";
import DataGrid, { Column, Export } from 'devextreme-react/data-grid';
import ExcelJS from 'exceljs';
import saveAs from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

const ExportToExcel = ({session, sessionId}) => {
    // const [models, setModels] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [modelSessions, setModelSessions] = useState([]);

    useEffect(() => {
        getModelSessions();
        async function getModelSessions() {
            try {
                const modelSessionsData = await getModelSessionsForSession(sessionId, "sessions");
                const mappedModels = await Promise.all(modelSessionsData.map(async (model, id) => {
                    const modelImage = await fetch(model.model.image)
                    const modelImageBlob = await modelImage.blob();
                    const modelImageBase64 = await getBase64Image(modelImageBlob);
                    return model = {
                        name: model.model.name,
                        sizes:` חולצה:${model.model.shirtSize}
                                מכנסיים:${model.model.pantsSize}
                                נעליים:${model.model.shoeSize}`,
                        height: model.model.height,
                        phone: model.model.phone,
                        hasTransportation: model.hasTransportation ? "הסעה" : "עצמאית",
                        note: model.model.note,
                        image: modelImageBase64,
                    };
                }));
                setModelSessions(mappedModels);
            } catch (err) {
                console.log(err)
            }
        }
    }, [session, sessionId]);

    async function getBase64Image(blob) {
        const reader = new FileReader();
        await new Promise((resolve, reject) => {
            reader.onload = resolve;
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        return reader.result
    }

    function onExporting(e) {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Main sheet');

        exportDataGrid({
            component: e.component,
            worksheet: worksheet,
            autoFilterEnabled: true,
            topLeftCell: { row: 3, column:3 },
            customizeCell: ({ gridCell, excelCell }) => {
                if(gridCell.rowType === 'data') {
                    if(gridCell.column.dataField === 'image') {
                        excelCell.value = undefined;

                        const image = workbook.addImage({ // https://github.com/exceljs/exceljs#images
                            base64: gridCell.value,
                            extension: 'png',
                        });

                        worksheet.getRow(excelCell.row).height = 120;
                        worksheet.addImage(image, {
                            tl: { col: excelCell.col - 1, row: excelCell.row - 1 },
                            br: { col: excelCell.col, row: excelCell.row }
                        });
                    }
                }
            }
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'DataGrid.xlsx');
            });
        });
        e.cancel = true;
    }

    function renderGridCell(cellData) {
        return (<div><img alt="" src={cellData.value}></img></div>);
    }

    return (
        <DataGrid
            id="gridContainer"
            dataSource={modelSessions}
            showBorders={true}
            showRowLines={true}
            showColumnLines={false}
            columnAutoWidth={true}
            onExporting={onExporting}>
            <Column dataField="note" />
            <Column dataField="hasTransportation" />
            <Column dataField="phone" />
            <Column dataField="sizes" />
            <Column dataField="height" />
            <Column dataField="name" />
            <Column dataField="image" width={90} cellRender={renderGridCell} />
            <Export enabled={true} />
        </DataGrid>
    );
};

export default ExportToExcel;