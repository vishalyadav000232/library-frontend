import authApi from "./Api";

const generateReport = async (reportType, startDate, endDate) => {
  try {
    const response = await authApi.get(`/reports/${reportType}`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error generating report:",
      error.response?.data?.detail || error.message,
    );
    throw error;
  }
};

export const generateReportPdf = async (reportType, startDate, endDate) => {
  try {
    const response = await authApi.get(`/reports/${reportType}/pdf`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.log("Error generating Report Pdf ", error.response?.data.detail);
  }
};



export const generateReportExcel = async ( reportType , startDate , endDate) =>{
    try {
        const response = await authApi.get(`/reports/${reportType}/excel`, {
            params: {
                start_date: startDate,
                end_date: endDate,
            },
            responseType: 'blob'
        });
        return response.data;   
    }
    catch (error) {
        console.log("Error generating Report Excel ", error.response?.data.detail);
        throw error;
    }       
}

export { generateReport };

