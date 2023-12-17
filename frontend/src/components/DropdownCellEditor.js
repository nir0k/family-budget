// DropdownCellEditor.js
function DropdownCellEditor() {}


DropdownCellEditor.prototype.init = function(params) {
    this.accountOptions = params.accountOptions;
    this.eGui = document.createElement('select');
    this.eGui.style.width = '100%';

    this.refreshOptions(params.values, params.property, params.value);
    this.eGui.addEventListener('change', () => {
        params.stopEditing();
    });
};


DropdownCellEditor.prototype.refreshOptions = function(values, property = 'title', selectedValue) {
    // Clear existing options
    this.eGui.innerHTML = '';

    values.forEach(item => {
        const option = document.createElement('option');
        option.value = item[property];
        option.text = item[property];
        this.eGui.appendChild(option);

        if (item[property] === selectedValue) {
            option.selected = true;
        }
    });
};


DropdownCellEditor.prototype.getGui = function() {
    return this.eGui;
};


DropdownCellEditor.prototype.afterGuiAttached = function() {
    this.eGui.focus();
};


// DropdownCellEditor.prototype.getValue = function() {
//     return this.eGui.value;
// };
DropdownCellEditor.prototype.getValue = function() {
    // Check if 'accountOptions' is provided and use it if available
    if (this.accountOptions) {
        const selectedTitle = this.eGui.value;
        const selectedAccount = this.accountOptions.find(acc => acc.title === selectedTitle);
        return selectedAccount ? selectedAccount.id : null; // Return ID for account options
    } else {
        return this.eGui.value; // For other dropdowns, return the selected value directly
    }
};


DropdownCellEditor.prototype.destroy = function() {
    // Cleanup if needed
};


DropdownCellEditor.prototype.isPopup = function() {
    return false;
};


export default DropdownCellEditor;
