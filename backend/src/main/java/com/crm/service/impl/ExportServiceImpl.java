package com.crm.service.impl;

import com.crm.entity.CustomerLead;
import com.crm.repository.CustomerLeadRepository;
import com.crm.service.ExportService;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExportServiceImpl implements ExportService {

    private final CustomerLeadRepository leadRepository;

    @Override
    public void exportLeadsToExcel(HttpServletResponse response) throws IOException {
        log.info("Exporting leads to Excel");
        List<CustomerLead> leads = leadRepository.findAll();

        try (XSSFWorkbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Customer Leads");
            
            // Header Row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            XSSFFont font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);

            String[] columns = {"ID", "Name", "Mobile", "Email", "Lead Type", "Status", "Priority", "City", "Created Date"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
                cell.setCellStyle(headerStyle);
            }

            // Data Rows
            int rowIdx = 1;
            for (CustomerLead lead : leads) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(lead.getId());
                row.createCell(1).setCellValue(lead.getCustomerName());
                row.createCell(2).setCellValue(lead.getMobile());
                row.createCell(3).setCellValue(lead.getEmail());
                row.createCell(4).setCellValue(lead.getLeadType() != null ? lead.getLeadType().getLeadTypeName() : "");
                row.createCell(5).setCellValue(lead.getStatus().name());
                row.createCell(6).setCellValue(lead.getPriority().name());
                row.createCell(7).setCellValue(lead.getCity());
                row.createCell(8).setCellValue(lead.getCreatedDate().toString());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }

            ServletOutputStream outputStream = response.getOutputStream();
            workbook.write(outputStream);
            outputStream.flush();
        }
    }

    @Override
    public void exportLeadsToPdf(HttpServletResponse response) throws IOException {
        log.info("Exporting leads to PDF");
        List<CustomerLead> leads = leadRepository.findAll();

        Document document = new Document(PageSize.A4.rotate());
        try {
            PdfWriter.getInstance(document, response.getOutputStream());
            document.open();
            
            // Explicitly use com.itextpdf.text.Font to avoid ambiguity with POI Font
            com.itextpdf.text.Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontHeader.setSize(18);
            Paragraph title = new Paragraph("Customer Leads Report", fontHeader);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph(" ")); // Spacer

            PdfPTable table = new PdfPTable(8);
            table.setWidthPercentage(100);
            
            String[] headers = {"ID", "Name", "Mobile", "Lead Type", "Status", "Priority", "City", "Created"};
            for (String h : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(h));
                cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                table.addCell(cell);
            }

            for (CustomerLead lead : leads) {
                table.addCell(lead.getId().toString());
                table.addCell(lead.getCustomerName());
                table.addCell(lead.getMobile());
                table.addCell(lead.getLeadType() != null ? lead.getLeadType().getLeadTypeName() : "");
                table.addCell(lead.getStatus().name());
                table.addCell(lead.getPriority().name());
                table.addCell(lead.getCity() != null ? lead.getCity() : "");
                table.addCell(lead.getCreatedDate().toLocalDate().toString());
            }

            document.add(table);
            document.close();
        } catch (DocumentException e) {
            log.error("Error creating PDF: {}", e.getMessage());
        }
    }
}
