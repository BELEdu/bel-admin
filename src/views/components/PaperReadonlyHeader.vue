<template>
  <header class="paper-preview-header">

    <!-- 试卷标题 -->
    <h2 :style="{margin: '0 0 16px 0',fontSize: '20px'}">
      {{data.paper_name || data.display_name || '暂无试卷标题'}}
    </h2>

    <!-- 试卷头部信息 -->
    <div class="paper-preview-header__info">
      <span
        v-for="(info,index) in formatPaperInfoArray"
        :key="index"
      >
        <!-- 项 -->
        {{info.name}}：{{info.value}}

        <!-- 单位 -->
        <span v-if="info.unit">
          {{info.unit}}
        </span>

        <!-- 分隔符 -->
        <span v-if="index !== formatPaperInfoArray.length-1">
          &nbsp;<b>|</b>&nbsp;
        </span>
      </span>
    </div>

  </header>
</template>

<script>
/**
 * 查看试卷 - 头部
 *
 * @author zhoumenglin
 */

export default {
  props: {
    // 试卷数据
    data: {
      type: Object,
      required: true,
    },
  },

  computed: {
    // 试卷总分
    paperTotalScore() {
      return this.data.question_types
        .map(question_type => question_type.total_score)
        .reduce((total, score) => total + score, 0)
    },

    // 试卷总题数
    paperTotalCount() {
      return this.data.question_types
        .map(question_type => question_type.question_count)
        .reduce((total, count) => total + count, 0)
    },

    // 试卷头部信息数组
    paperInfo() {
      return [
        {
          name: '年份',
          value: this.data.year,
        },
        {
          name: '年级',
          value: this.data.grade_name,
        },
        {
          name: '类型',
          value: this.data.paper_type_name,
        },
        {
          name: '区域',
          value: this.data.area_name,
        },
        {
          name: '题数',
          value: this.data.question_count || this.paperTotalCount,
          unit: '题',
        },
        {
          name: '总分',
          value: this.data.total_score || this.paperTotalScore,
          unit: '分',
        },
      ]
    },

    // 过滤出可用的试卷信息
    formatPaperInfoArray() {
      const infoArray = this.paperInfo

      // 读取时长信息
      const durationInfo = this.data.exam_time || this.data.total_time

      // 如果有时长并且时长为0的时候，将文字替换为无限制
      if (durationInfo === 0) {
        infoArray.push(
          {
            name: '时长',
            value: '无限制',
          },
        )
      } else {
        infoArray.push(
          {
            name: '时长',
            value: durationInfo,
            unit: '分钟',
          },
        )
      }

      // 过滤出可用的试卷信息字段
      return infoArray.filter(info => (info.value !== null && info.value !== undefined))
    },
  },
}
</script>

<style lang="less">
@import "~vars";
@import './style/paperReadonly.less';

.paper-preview-header {
  margin-bottom: 20px;

  & > h2 {
    margin-bottom: 5px;
    font-size: 18px;
  }

  &__info {

    & > span {
      position: relative;
      font-size: 14px;
    }
  }
}

</style>
