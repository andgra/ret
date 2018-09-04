import DefectsPrint from '~pages/print/defects.vue';
import WorksPrint from '~pages/print/works.vue';
import ResultsPrint from '~pages/print/results.vue';
import OperationsPrint from '~pages/print/operations.vue';
import ResourcesPrint from '~pages/print/resources.vue';
import OverrunPrint from '~pages/print/overrun.vue';

let output = {
  'defects-table': DefectsPrint,
  'works-table': WorksPrint,
  'results-table': ResultsPrint,
  'operations-table': OperationsPrint,
  'resources-table': ResourcesPrint,
  'overrun-table': OverrunPrint,
};

export default output;