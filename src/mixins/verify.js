/**
 * 验证操作权限
 * @author  chenliangshan
 * @version 2017/11/15
 */

export default {
  methods: {
    verifyPermissions(val) {
      return this.$store.getters.permissionsNames.includes(val)
    },
  },
}
