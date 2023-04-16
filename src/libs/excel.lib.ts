import { Workbook } from 'exceljs';
import { join } from 'path';

export interface ExcelData {
    id: string;
    name: string;
    message: string;
    _v: number;
}

export const generateExcel = async (data: Array<ExcelData>) => {
    const workbook = new Workbook();
    const sheet = workbook.addWorksheet('Messages');

    sheet.columns = [
        { header: 'ID', key: '_id', width: 50 },
        { header: 'Name', key: 'name', width: 50 },
        { header: 'Email', key: 'email', width: 50 },
        { header: 'Message', key: 'message', width: 250 },
    ];

    sheet.addRows(data);

    await workbook.xlsx.writeFile(join(process.cwd(), `asl-message.xlsx`));
    return true;
};
