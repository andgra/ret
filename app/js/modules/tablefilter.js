require('tablesaw/dist/tablesaw.jquery');
// require('tablesaw/dist/tablesaw-init');
window.TableFilter = require('tablefilter');
TableFilter.prototype.refresh = function () {
  this.destroy();
  this.init();
};
TableFilter.prototype.refreshFilters = function () {
  let slcA1 = this.getFiltersByType('select', true),
      slcA2 = this.getFiltersByType('multiple', true),
      slcA3 = this.getFiltersByType('checklist', true),
      slcIndex = slcA1.concat(slcA2);
  slcIndex = slcIndex.concat(slcA3);

  slcIndex.forEach((colIdx) => {
    let curSlc = this.getFilterElement(colIdx);
    this.Mod.dropdown.init(colIdx, this.isExternalFlt(), curSlc);

  });
};

export default TableFilter;