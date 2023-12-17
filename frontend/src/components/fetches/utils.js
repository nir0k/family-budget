export const getCurrentDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
  
export const currencyFormatter = (params) => {
    return parseFloat(params.value).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
  
export const dateFormatter = (params) => {
    let dateObj = new Date(params.value);
    return dateObj.toLocaleDateString();
}
  