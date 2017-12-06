import AppButtonRadio from './AppButtonRadio'
import AppEditorTitle from './AppEditorTitle'
import AppPager from './AppPager'
import AppFormModal from './AppFormModal'
import AppWarnModal from './AppWarnModal'
import AppFormAlert from './AppFormAlert'
import AppDictsFilter from './AppDictsFilter'
import AppUploader from './AppUploader'
import AppTreeSelect from './AppTreeSelect'
import AppDatePicker from './AppDatePicker'
import AppTimePicker from './AppTimePicker'
import AppMapCascader from './AppMapCascader'
import AppEcharts from './AppEcharts'
import AppEditor from './AppEditor'
import AppTableForm from './AppTableForm'
import AppUpload from './AppUpload'

const rbdog = {
  AppButtonRadio,
  AppEditorTitle,
  AppPager,
  AppFormModal,
  AppWarnModal,
  AppFormAlert,
  AppDictsFilter,
  AppUploader,
  AppTreeSelect,
  AppDatePicker,
  AppTimePicker,
  AppMapCascader,
  AppEcharts,
  AppEditor,
  AppTableForm,
  AppUpload,
}

const install = (Vue) => {
  Object.keys(rbdog).forEach((key) => {
    // 注册全局组件
    Vue.component(key, rbdog[key])
  })
}

export default { ...rbdog, install }
