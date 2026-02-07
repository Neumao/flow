/**
 * Unified API response helper with fluent API
 */
class ApiResponse {
    /**
     * Success response
     * @param {string} message - Success message
     * @param {any} data - Optional response data
     * @param {object} pagination - Optional pagination info
     */
    success(message, data = null, pagination = null) {
        const response = {
            status: true,
            message,
            data,
        };
        if (pagination !== null) {
            response.pagination = pagination;
        }
        return response;
    }

    /**
     * Error response
     * @param {string} message - Error message
     */
    error(message, data = null) {
        return {
            status: false,
            message,
            data,
        };
    }
}

export const apiResponse = new ApiResponse();
