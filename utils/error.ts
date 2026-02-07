export const getApiErrorMessage = (error: any, defaultMessage: string = 'Terjadi kesalahan sistem'): string => {
    if (error?.data?.error) {
        return error.data.error
    }
    if (error?.data?.message) {
        return error.data.message
    }
    if (error?.response?._data?.error) {
        return error.response._data.error
    }
    return error?.message || defaultMessage
}
