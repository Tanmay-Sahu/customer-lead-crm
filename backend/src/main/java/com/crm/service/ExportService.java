package com.crm.service;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

public interface ExportService {
    void exportLeadsToExcel(HttpServletResponse response) throws IOException;
    void exportLeadsToPdf(HttpServletResponse response) throws IOException;
}
