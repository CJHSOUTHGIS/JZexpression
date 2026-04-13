/**
 * 平台表单样式样式更改方法体
 */
// 注册评分组件
Sgui.$root.constructor.component("SgRate", window.top.SgRate);
Sgui.$root.constructor.component("SgDescriptions", window.top.SgDescriptions);
Sgui.$root.constructor.component(
    "SgDescriptionsItem",
    window.top.SgDescriptionsItem
);
// 注册单选按钮组组件
Sgui.$root.constructor.component("SgRadio", window.top.SgRadio);
Sgui.$root.constructor.component("SgRadioGroup", window.top.SgRadioGroup);
Sgui.$root.constructor.component("SgRadioButton", window.top.SgRadioButton);
// 注册时间线组件
Sgui.$root.constructor.component("SgTimeline", window.top.SgTimeline);
Sgui.$root.constructor.component("SgTimelineItem", window.top.SgTimelineItem);
// 注册进度环组件
Sgui.$root.constructor.component("SgCircle", window.top.SgCircle);
// 注册进度滑块组件
Sgui.$root.constructor.component("SgSlider", window.top.SgSlider);
// 注册进度组件
Sgui.$root.constructor.component("SgProgress", window.top.SgProgress);

function FormStyleDetailUtil() {
  /**
   * 项目标题的样式替换
   * @param selector
   * @param stateLabel
   * @param stateColor
   * @param title
   * @param btnList
   */
  this.sInfo_projectNavBox = function (
      selector,
      stateLabel,
      stateColor,
      title,
      btnList,
      rateScore
  ) {
    // 样式表
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_projectNavBox",
      style: `
    .sInfo_projectNavBox {
  
    }
    
    .sInfo_projectNavBox .sInfo_projectNavContent {
      background: #84b9eb;
      border-radius: 4px 0 0 4px;
      height: 84px;
      display: flex;
      align-items: center;
    }
    
    .sInfo_projectNavBox .stateBox {
      width: 30px;
      height: 74px;
      border-radius: 0 4px 4px 0;
      font-size: 16px;
      line-height: 18px;
      font-weight: bold;
      color: #fff;
      display: flex;
      align-items: center;
      text-align: center;
    }
    
    .sInfo_projectNavBox .titleBox {
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      margin-left: 26px;
    }
    
    .sInfo_projectNavBox .btnList {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      margin-right: 36px;
    }
    
    .sInfo_projectNavBox .btnList .btnItem {
      height: 32px;
      background: #fff;
      border-radius: 4px;
      padding: 8px;
      font-size: 16px;
      line-height: 1;
      font-weight: bold;
      color: #2b84e0;
      cursor: pointer;
      margin-left: 10px;
    }
    
    .sInfo_projectNavBox .btnList .btnItem.darkBtn {
      background: #3e73a6;
      color: #d2e8ff;
    }
  
    .sInfo_projectNavBox .rateScore {
      display: flex;
      flex: 1;
      color: #333;
      font-weight: bold;
      align-items: center;
      justify-content: flex-end;
    }
  `,
    });
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
      <div class="sInfo_projectNavBox">
        <div class="sInfo_projectNavContent">
          <div v-if="stateLabel" class="stateBox" :style="'background: '+stateColor">{{ stateLabel }}</div>
          <div class="titleBox">{{ title }}</div>
          <div v-if="rateScore" class="rateScore">
            <h3>综合评价</h3>
            <sg-rate
              :value="Number(rateScore)"
              disabled
              text-color="#ff9900">
            </sg-rate>
            <span class="ant-rate-text">{{ rateDesc[Number(rateScore) - 1] }}</span>
          </div>
          <div class="btnList" :style="{flex:rateScore?'unset':1}">
            <div v-for="(btn, index) in btnList" :class="btn.bgStyle+'Btn btnItem'" @click="btn.onClick">{{ btn.label }}</div>
          </div>
        </div>
      </div>
    `,
        data() {
          return {
            stateLabel: stateLabel,
            stateColor: stateColor || "#6fa10f",
            title: title,
            btnList: btnList,
            rateScore: rateScore, // 评价分数
            rateDesc: ["1星", "2星", "3星", "4星", "5星"],
          };
        },
      },
      selector: selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 标题格式替换（测绘单位使用）
   * @param selector
   * @param domId
   * @param params
   * @returns {{editInfo: string, domId, stateLabel, title}|{backgroundImage: string}}
   */
  this.sinfo_unitNavBox = (selector, domId, params) => {
    let { title, stateLabel, stateBgImg, editInfo } = params;
    // 样式表
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sinfo_unitNavBox",
      style: `
      .sinfo_unitNavBox {
      }
      
      .sinfo_unitNavBox .sinfo_unitNavContent {
        position: relative;
        background: #659cd4;
        border-radius: 4px 4px 0 0;
        height: 84px;
        display: flex;
        align-items: center;
      }
      
      .sinfo_unitNavBox .titleBox {
        font-size: 24px;
        font-weight: bold;
        color: #fff;
        margin-left: 30px;
      }

      .sinfo_unitNavBox .stateBox {
        width: 89px;
        height: 56px;
        position: absolute;
        right: 18px;
        top: -9px;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        padding-bottom: 10px;
      }

      .sinfo_unitNavBox .editInfoBox {
        position: absolute;
        right: 26px;
        bottom: 14px;
        font-size: 14px;
        color: #bbdbfd;
      }
    `,
    });
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div class="sinfo_unitNavBox" :id="domId">
          <div class="sinfo_unitNavContent">
            <div class="titleBox">{{ title }}</div>
            <div class="stateBox" :style="stateBoxStyle">
              {{ stateLabel }}
            </div>
            <div class="editInfoBox">
              {{ editInfo }}
            </div>
          </div>
        </div>
      `,
        data() {
          return {
            domId: domId,
            title: title,
            stateLabel: stateLabel,
            editInfo: "最后更新： " + editInfo,
          };
        },
        computed: {
          stateBoxStyle() {
            return {
              backgroundImage: "url(" + stateBgImg + ")",
            };
          },
        },
      },
      selector: selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 标题格式替换（监督管理系统-测绘单位详情页标题）
   * @param selector
   * @param domId
   * @param params
   * @returns {{score, logoSrc, name, status,levelSrc}}
   */
  this.sinfo_unitNavBoxVersion2 = (selector, domId, params) => {
    let { name, score, status, logoSrc, levelSrc, levelLabel } = params;
    let vueComponent = {
      template: `
    <div style="text-align: center; width: 100%; padding: 20px; display: flex;" :id="domId">
      <img :src="logoSrc" :style="'height:'+imgHeight+';'"></img>
      <div style="font-size: 14px; color: #333333; line-height: 1; margin-left: 30px; flex: 1; display: flex; align-items: center; justify-content: space-between;">
        <div>
          <h3 style="color: #333; font-size: 20px; font-weight: bold;">{{ name }}</h3>
          <div style="padding-top: 15px;">
            <span style="color: #999; margin-right: 47px;">信用分数：<span style="color: #2B84E0; padding: 3px 8px; background: #F2F9FE;">{{ score }}</span></span>
            <span style="color: #999">状态：<span style="color: #2B84E0; padding: 5px 10px; background: #F2F9FE;">{{ status }}</span></span>
          </div>
        </div>
        <div :style="levelLabelStyle" style="width: 100px; height: 100px; background-size: 100% 100%; text-align: center; padding-top: 68px; font-size: 14px; font-weight: bold; color: #fff;">
          {{ levelLabel }}
        </div>
      </div>
    </div>
  `,
      data() {
        return {
          logoSrc: logoSrc,
          levelSrc: levelSrc,
          imgHeight: "80px",
          name: name,
          score: score,
          status: status,
          levelLabel: levelLabel,
          domId: domId,
        };
      },
      computed: {
        levelLabelStyle() {
          return {
            backgroundImage: "url(" + this.levelSrc + ")",
          };
        },
      },
    };
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: vueComponent,
      selector: selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 流程状态（横向）
   * @param params
   */
  this.sinfo_progressStatus = (params) => {
    let { vue, selector, stepsParams } = params;
    const { addCssStyle, renderCustomVue } = window.top.IBaseExpressLib;
    let vueComponent = {
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
          <div style="width: 100%; padding: 20px;" :id="controlId">
            <div style="display: flex;">
              <div style="margin-top: 5px; margin-right: 15px;"><span style="padding: 5px 10px; border-radius: 4px;" :class="infoType">{{ infoTypeText }}</span></div>
              <div style="display: flex; flex-direction: column; flex: 1;">
                <h3 style="font-size: 18px; font-weight: bold; color: #333; margin-bottom: 3px;">{{ infoTitle }}</h3>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <p style="margin-bottom: 0; font-weight: 400; color: #666;">{{ workOrderNo }}</p>
                  <p 
                    style="margin-bottom: 0;  border-radius: 2px; font-weight: 400; padding: 2px 5px;"
                    :style="infoStatus === 1 ? 'background: #efefef; color: #666;' : infoStatus === 2 ? 'background: #DFEFFC; color: #155EDE;' : 'background: #FCF2DF; color: #E7A21A;'"
                  >{{ infoStatusText }}</p>
                </div>
              </div>
            </div>
            <div>
              <sg-step :step-arr="stepArr" :active-step="currentStep" slot-name="slotName" slot-des="slotDes" direction="horizontal" style="width: 100%;">
                <div slot="slotName" class="title" slot-scope="item">
                  <div style=" background: #F2F6FA !important;">{{ item.name }}</div>
                </div>
                <div slot="slotDes" slot-scope="item" class="desc">
                  <div style=" background: #F2F6FA !important;">{{ item.userName }}</div>
                  <div style=" background: #F2F6FA !important;">{{ item.time }}</div>
                </div>
              </sg-step>
            </div>
          </div>
        `,
          data() {
            return {
              currentStep: stepsParams.currentStep,
              controlId: stepsParams.controlId,
              stepArr: stepsParams.stepArr,
              infoType: stepsParams.infoType, // 消息类型 consult -- 咨询  complain -- 投诉 other -- 其他
              infoTypeText: stepsParams.infoTypeText, // 信息类型中文
              infoTitle: stepsParams.infoTitle, // 信息标题
              workOrderNo: stepsParams.workOrderNo, // 工单号
              infoStatus: stepsParams.infoStatus, // 状态 0 -- 待提交 1 -- 已处理  2 -- 处理中
              infoStatusText: stepsParams.infoStatusText,
            };
          },
          mounted() {
            // 流程进度样式
            addCssStyle({
              vue,
              id: "stepsArr" + this.controlId,
              style: `
              .consult {
                background: #FCF2DF;
                border: 1px solid #E7A21A;
                color: #E7A21A;
              }
      
              .complain {
                background: #ECFEF8;
                border: 1px solid #2AB787;
                color: #2AB787;
              }
      
              .other {
                background: #F2F9FE;
                border: 1px solid #2B84E0;
                color: #2B84E0;
              }

              #${this.controlId} .sg-step {
                background: #F2F6FA;
                padding: 10px 20px 10px 60px;
                margin-top: 10px;
              }

              #${this.controlId} .sg-step .process-line {
                width: 100%;
              }
  
              #${this.controlId} .sg-step-horizontal.sg-step-theme-hollow .process-line > div {
                width: 33.33%;
                text-align: left;
              }

              #${this.controlId} .sg-step-horizontal.sg-step-theme-hollow .process-line>div:not(:last-of-type):after {
                width: 100%;
                left: 0;
              }

              #${this.controlId} .sgui-font:before {
                position: relative;
                left: 6px;
              }

              #${this.controlId} .sg-step-horizontal.sg-step-theme-hollow .process-line>div>div>span {
                text-align: center;
              }

              #${this.controlId} .sg-step-horizontal.sg-step-theme-hollow .process-line>div>p {
                margin-top: 0;
              }

              #${this.controlId} .sg-step .class {
                font-weight: bold;
              }

              #${this.controlId} .sg-step .desc {
                color: #666;
                font-size: 12px;
              }
            `,
            });
          },
        });
      },
    };

    renderCustomVue({
      vue,
      vueComponent: vueComponent,
      selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 资质等级图标
   * @param selector
   * @param domId
   * @param params
   * @returns {{backgroundImage: string}|{levelLabel, domId}}
   */
  this.sinfo_unitNavLevel = (selector, domId, params) => {
    let { levelLabel, levelBgImg } = params;
    // 样式表
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sinfo_unitNavLevel",
      style: `
      .sinfo_unitNavLevel {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }
      
      .sinfo_unitNavLevel .sinfo_unitNavLevelLabel {
        width: 100px;
        height: 100px;
        background-size: 100% 100%;
        text-align: center;
        padding-top: 68px;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
      }
      
      .sinfo_unitNavLevel .sinfo_unitNavLevelTip {
        width: 184px;
        height: 24px;
        margin-top: 12px;
        position: relative;
      }

      .sinfo_unitNavLevel .sinfo_unitNavLevelTip .sinfo_unitNavLevelTipBg1 {
        position: absolute;
        width: 184px;
        border-color: transparent transparent #cdddec;
        border-style: none solid solid;
        border-width: 0 12px 12px;
        bottom: 0;
      }

      .sinfo_unitNavLevel .sinfo_unitNavLevelTip .sinfo_unitNavLevelTipBg2 {
        position: absolute;
        width: 128px;
        border-color: transparent transparent #6e94bb;
        border-style: none solid solid;
        border-width: 0 24px 24px;
        left: 0;
        right: 0;
        margin: 0 auto;
      }

      .sinfo_unitNavLevel .sinfo_unitNavLevelTip .sinfo_unitNavLevelTipTxt {
        position: absolute;
        text-align:center;
        width: 184px;
        font-size: 14px;
        line-height: 24px;
        color: #fff;
      }
    `,
    });
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div class="sinfo_unitNavLevel" :id="domId">
          <div class="sinfo_unitNavLevelLabel" :style="levelLabelStyle">
            {{ levelLabel }}
          </div>
          <div class="sinfo_unitNavLevelTip">
            <div class="sinfo_unitNavLevelTipBg1" />
            <div class="sinfo_unitNavLevelTipBg2" />
            <div class="sinfo_unitNavLevelTipTxt">所获等级</div>
          </div>
        </div>
      `,
        data() {
          return {
            domId: domId,
            levelLabel: levelLabel, // 等级文本
          };
        },
        computed: {
          levelLabelStyle() {
            return {
              backgroundImage: "url(" + levelBgImg + ")",
            };
          },
        },
        mounted() {
          // 这里的this指当前渲染的vue实例，可以当成平台有时暴露出的控件对象去理解
          // 把实例保存到全局后，就可以做修改实变量的一些操作，比如下方的模拟修改等级文本
          window.sinfo_unitNavLevelCom = this;
        },
      },
      selector: selector, // 平台表单的预留格子的dom
    });
  };
  /**
   * 定制基本信息表单样式（去掉禁止的鼠标手势、去掉背景颜色、去掉下拉框右边的下拉图标、设置上下行之间的边框颜色）
   */
  this.sInfo_customShowFormStyle = function (formId) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_customShowForm_" + formId,
      style: `
      /* 去掉禁止的鼠标手势 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-input[disabled] {
        cursor: default;
      }

      /* 去掉背景颜色 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-disabled .sg-select-selection {
        background-color: transparent;
      }

      /* 去掉下拉框右边的下拉图标 */
      #${formId} .sg-select-disabled .sg-select-selection .sg-select-arrow {
        display: none;
      }

      /* 设置上下行之间的边框颜色，这里为了凸显测试效果是写了红色，实际应用把 #EFEFEF 换成 #efefef  */
      #${formId} .widget-table > tr {
        border-top: 1px solid #EFEFEF !important;
        border-bottom: 1px solid #EFEFEF !important;
      }

      #${formId} .widget-table {
        position: relative;
      }

      #${formId} .widget-table::before, #${formId} .widget-table::after {
        content: '';
        position: absolute;
        top: 0;
        width: 1px;
        height: 100%;
        background: #EFEFEF;
      }

      #${formId} .widget-table::before {
        left: 0;
      }

      #${formId} .widget-table::after {
        right: 0;
      }
    `,
    });
  };

  /**
   * 定制基本信息表单样式（去掉禁止的鼠标手势、去掉背景颜色、去掉下拉框右边的下拉图标、边框只有上边框）
   */
  this.sInfo_customShowFormStyle_borderOnlyTop = function (formId) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_customShowForm_" + formId,
      style: `
      /* 去掉禁止的鼠标手势 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-input[disabled] {
        cursor: default;
      }

      /* 去掉背景颜色 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-disabled .sg-select-selection {
        background-color: transparent;
      }

      /* 去掉下拉框右边的下拉图标 */
      #${formId} .sg-select-disabled .sg-select-selection .sg-select-arrow {
        display: none;
      }
      
      /* 设置上下行之间的边框颜色，这里为了凸显测试效果是写了红色，实际应用把 #EFEFEF 换成 #efefef  */
      #${formId} .widget-table > tr {
        border-top: 1px solid #ebebeb !important;
      }
      
      #${formId} .widget-table {
        position: relative;
      }
      #${formId} .widget-table::before {
        left: 0;
      }

      #${formId} .widget-table::after {
        right: 0;
      }
    `,
    });
  };

  /**
   * 定制基本信息表单样式（去掉禁止的鼠标手势、去掉背景颜色、去掉下拉框右边的下拉图标、无边框）
   */
  this.sInfo_customShowFormStyle_withOutBorder = function (formId) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_customShowForm_" + formId,
      style: `
      /* 去掉禁止的鼠标手势 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-input[disabled] {
        cursor: default;
      }

      /* 去掉背景颜色 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-disabled .sg-select-selection {
        background-color: transparent;
      }

      /* 去掉下拉框右边的下拉图标 */
      #${formId} .sg-select-disabled .sg-select-selection .sg-select-arrow {
        display: none;
      }
            
      #${formId} .widget-table {
        position: relative;
      }
      #${formId} .widget-table::before {
        left: 0;
      }

      #${formId} .widget-table::after {
        right: 0;
      }
    `,
    });
  };

  /**
   * 定制基本信息表单样式（表格间距问题）
   */
  this.sInfo_customShowFormStyle_TableHeight = function (formId) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_customShowForm_" + formId,
      style: `
            /* 表格间距 */
            #${formId} .sg-table.sg-table-default tbody tr, #${formId} .sg-table.sg-table-default thead tr {
              height: 26px;
            }

            #${formId} .sg-table.sg-table-default tr td {
              padding: 0;
              height: 26px;
            }
          `,
    });
  };

  /**
   * 定制子表单中控件样式
   */
  this.sInfo_customControlStyle = function (formId) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_customShowForm_" + formId,
      style: `
      /* 去掉禁止的鼠标手势 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-input[disabled] {
        cursor: default;
      }

      /* 去掉背景颜色 */
      #${formId} .sg-input:disabled, #${formId} .sg-select-disabled .sg-select-selection {
        background-color: transparent;
      }

      /* 去掉下拉框右边的下拉图标 */
      #${formId} .sg-select-disabled .sg-select-selection .sg-select-arrow {
        display: none;
      }
    `,
    });
  };
  /**
   * 定制表样式（目前用于平台的子表控件）
   */
  this.sInfo_customShowTableStyle = function (tableId) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sinfo_customShowTable_" + tableId,
      style: `
      /* 表格行的内容垂直居中 */
      #${tableId} .sg-table .sg-table-tbody .sg-table-row .sg-table-cell > div {
        align-items: center;
      }
      
      /* 临时修复：表格的多选控件出现额外滚动条 */
      #${tableId} .sg-table .sg-table-tbody .sg-table-row .sg-table-cell .item-checkbox-box .sg-checkbox-inner {
        display: block;
      }
    `,
    });
  };

  /**
   * 文件树文件下载
   * @type {*[]}
   */
  let downloadTreeArr = [];
  function downLoadFileTree(nodes) {
    //处理文件树
    downloadTreeArr = [];
    getTreeItem(nodes, "");
    if (downloadTreeArr.length === 0) {
      co.Message.info_middle("无可下载文件");
    } else {
      co.Toolbox.showMask();
      const axios = window.top.axios || axios;
      axios({
        method: "post",
        url: "/filemgr/comm/downFiles",
        responseType: "blob",
        headers: {
          "Content-type": "application/x-www-form-urlencoded",
        },
        data: {
          macroPath: downloadTreeArr,
        },
        transformRequest: [
          function (data) {
            let ret = "";
            for (let it in data) {
              ret +=
                  encodeURIComponent(it) +
                  "=" +
                  encodeURIComponent(data[it]) +
                  "&";
            }
            return ret;
          },
        ],
      })
          .then((res) => {
            co.Toolbox.hideMask();
            downloadZip(res, nodes.label);
          })
          .catch((error) => {
            co.Toolbox.hideMask();
            console.log(error);
          });
    }
  }

  /**
   * 拼接文件树下载数据
   * @param nodes
   * @param parentDir
   */
  function getTreeItem(nodes, parentDir) {
    if (nodes.customData.fileType === "1") {
      downloadTreeArr.push(
          parentDir + nodes.customData.fileName + "|" + nodes.customData.filePath
      );
    } else if (nodes.children) {
      let curParentDir = parentDir + nodes.label + "/";
      for (let i = 0; i < nodes.children.length; i++) {
        getTreeItem(nodes.children[i], curParentDir);
      }
    }
  }

  /**
   * 下载文件流
   * @param data
   * @param filename
   */
  function downloadZip(data, filename) {
    if (!data) {
      return;
    }
    let url = window.URL.createObjectURL(
        new Blob([data], { type: "application/octet-stream;charset=UTF-8" })
    );
    let link = document.createElement("a");
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", filename + ".zip");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * 渲染文件树(使用window[controlId + "_fileTree"].getResTreeData()进行数据刷新)使用params
   * @param params
   * {
   *             controlId,//替换dom的Id
   *             getUrl = "",//获取数据的get请求接口
   *             getParams = null,//获取数据的get请求参数
   *             showObject = null,//数据展示对象
   *             fileDownloadBtn = true,//下载按钮是否展示
   *             emptyText = "暂无数据",//没数据展示什么文案
   *             isShowTopRightBtn = false,// 是否显示右上角按钮
   *             topRightBtnText = "",// 右上角按钮文案
   *             topRightBtnFun = () => {
   *             }// 右上角按钮方法
   *         }
   */
  this.sInfo_fileTreeWithParams = function (params) {
    const {
      controlId, //替换dom的Id
      getUrl = "", //获取数据的get请求接口
      getParams = null, //获取数据的get请求参数
      showObject = null, //数据展示对象
      fileDownloadBtn = true, //下载按钮是否展示
      emptyText = "暂无数据", //没数据展示什么文案
      isShowTopRightBtn = false, // 是否显示右上角按钮
      topRightBtnText = "", // 右上角按钮文案
      topRightBtnFun = () => {}, // 右上角按钮方法
      deleteCallback = () => {} // 删除数据后回调 一般用于数据刷新
    } = {
      ...(params || {})
    };
    const {
      fileTree
    } = window.top.IBaseExpressLib;
    fileTree({
      vue: Sgui,
      selector: document.getElementById(controlId), // dom目标，比如平台表单的预留格子的dom
      fileTreeParams: {
        controlId: controlId,
        filter: false, // 是否可以筛选节点，为true头部会出现筛选输入框
        style: {
          width: "100%",
          margin: 0,
        }, // 动态树样式
        fileDownloadBtn: fileDownloadBtn, // 是否显示下载按钮
        isGotoForm: false, // 是否是跳转系统表单
        isPasswordModal: false, // 是否是加密下载
        isPartFileUrl: true, // 是否是不完整的下载url，需要走特殊处理的下载文件
        emptyText: emptyText, // 没有数据时的提示
        isShowTopRightBtn: isShowTopRightBtn, // 是否显示右上角按钮
        topRightBtnText: topRightBtnText, // 右上角按钮文案
        fileType: getParams ? getParams.type : "", // 树类型类型，删除时用到
        // 右上角按钮方法
        topRightBtnFun: () => {
          if (topRightBtnFun) {
            topRightBtnFun();
          }
        },
        // 删除数据后回调 一般用于数据刷新
        deleteCallback: deleteCallback,
        fileDownloadCallback: (nodes) => {
          console.log(JSON.stringify(nodes));
        },
        isPartFileCallback: (nodes) => {
          console.log(JSON.stringify(nodes));
          if (nodes.customData.fileType == "1") {
            window.open(
              "/sinfoweb/file/public/downFileByPath?macroPath=" +
              encodeURIComponent(nodes.customData.filePath) +
              "&fileName=" +
              encodeURIComponent(nodes.customData.fileName)
            );
          } else {
            debugger;
            downLoadFileTree(nodes);
          }
        }, // 处理返回的路径是不完全的，传到回调函数用表达式处理其逻辑
        isGotoFormCallback: (formid, rid) => {
          console.log(formid, rid);
        }, // 跳转表单回调
        // 获取文件树接口数据
        customTreeDataFun: () => {
          return new Promise((resolve, reject) => {
            if (showObject) {
              resolve(showObject);
            } else {
              try {
                const axios = window.top.axios || axios;
                // TODO: 符合格式的接口，上面参数看情况改
                axios({
                    method: "get",
                    url: getUrl,
                    params: getParams,
                  })
                  .then((res) => {
                    resolve(res);
                  })
                  .catch((error) => {
                    reject(error);
                  });
              } catch (error) {
                reject(error);
              }
            }
          });
        },
      },
    }).then((tree) => {
      window[controlId + "_fileTree"] = tree;
      console.log("tree:");
      console.log(tree);
    });
  };

  /**
   * 渲染文件树(使用window[controlId + "_fileTree"].getResTreeData()进行数据刷新)
   * @param controlId
   * @param getUrl
   * @param getParams
   */
  this.sInfo_fileTree = function (
      controlId,
      getUrl,
      getParams,
      showObject,
      fileDownloadBtn,
      emptyText
  ) {
    this.sInfo_fileTreeWithParams({
      controlId: controlId,
      getUrl: getUrl,
      getParams: getParams,
      showObject: showObject,
      fileDownloadBtn: fileDownloadBtn,
      emptyText: emptyText,
    });
  };
  /**
   * 渲染普通树
   * @param param
   */
  this.sInfo_commonTree = function (param) {
    let {
      controlId = "",
      height = "",
      changeTreeDom = null,
      finishFun = (tree) => {},
      customTreeDataFun = (node, other) => {},
      onNodeClick = (node, other) => {},
      showCheckbox = false,
      defaultExpandAll = false,
      ...other
    } = param;
    window.top.IBaseExpressLib.fileTree({
      vue: Sgui,
      selector: document.getElementById(controlId), // dom目标，比如平台表单的预留格子的dom
      fileTreeParams: {
        filter: false, // 是否可以筛选节点，为true头部会出现筛选输入框
        style: {
          width: "100%",
          margin: 0,
          height: height,
          border: "1px solid #ccc",
        }, // 动态树样式
        showCheckbox: showCheckbox, // 是否显示多选框
        defaultExpandAll: defaultExpandAll, //是否全展开 默认否
        onNodeClick: (node) => {
          console.log(node);
          if (onNodeClick) {
            onNodeClick(node);
          }
          // if(changeTreeDom){
          //     changeTreeDom.getResTreeData(node, '附加参数');//附加参数有需要再加
          // }
        },
        // 获取文件树接口数据
        customTreeDataFun: (node, other) => {
          console.log(node, other);
          if (customTreeDataFun) {
            return customTreeDataFun(node, other);
          }
          // return new Promise((resolve, reject) => {
          //     if (showObject) {
          //         resolve(showObject)
          //     } else {
          //         try {
          //             const axios = window.top.axios || axios
          //             // TODO: 符合格式的接口，上面参数看情况改
          //             axios({
          //                 method: "get",
          //                 url: getUrl,
          //                 params: getParams
          //             }).then(res => {
          //                 resolve(res)
          //             }).catch(error => {
          //                 reject(error)
          //             })
          //         } catch (error) {
          //             reject(error)
          //         }
          //     }
          // })
        },
      },
    }).then((tree) => {
      finishFun(tree);
      console.log(tree);
    });
  };

  /**
   * 标签页隐藏
   * @param controlId
   * @param index
   */
  this.hideTabControlId = function (controlId, index, isHide) {
    co.Dom.domIsLoaded(() => {
      let k = false;
      if (document
              .getElementById(controlId)
          && document
              .getElementById(controlId)
              .querySelectorAll(".sg-tab-tab.is-top-bottom")[index]) {
        k = true;
      }
      return k;
    }, null, () => {
      if (isHide) {
        $(document
            .getElementById(controlId)
            .querySelectorAll(".sg-tab-tab.is-top-bottom")[index]
        ).hide();
      } else {
        $(document
            .getElementById(controlId)
            .querySelectorAll(".sg-tab-tab.is-top-bottom")[index]
        ).show();
      }
    })
  };

  /**
   * 左上角状态
   * @param controlId
   * @param str
   * @returns {{baseStyle: string, domId, label}}
   */
  this.leftTopText = function (controlId, str) {
    let vueComponent = {
      template: `
    <div :id="domId">
      <div :style="baseStyle">{{ label }}</div>
    </div>
  `,
      data() {
        return {
          domId: controlId,
          baseStyle:
              "position: fixed; top: 40px; left: 90px; font-weight: bolder; font-size: 16px;",
          label: str,
        };
      },
    };

    // 控制台测试时用这段
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: vueComponent,
      selector: document.getElementById(controlId), // 平台表单的预留格子的dom
      domId: controlId,
    });
  };

  /**
   * 替换成a标签展示数据
   * @param selector
   * @param aLabel
   */
  this.sInfo_renderToA = function (domId, aLabel) {
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div :id="domId" :style="boxStyle">
          <a style="color:#3b86e0">{{ btnLabel }}</a>
        </div>
      `,
        data() {
          return {
            domId: domId,
            btnLabel: aLabel,
          };
        },
        computed: {
          boxStyle() {
            return Object.assign(
                {},
                {
                  padding: "10px",
                }
            );
          },
        },
      },
      selector: document.getElementById(domId), // 平台表单的预留格子的dom
    });
  };

  /**
   * 替换格子生成下载按钮
   * @param selector
   * @param btnLabel
   * @param fileUrl
   * @param fileName
   */
  this.sInfo_renderDownloadBtn = function (
      domId,
      btnLabel,
      fileUrl,
      fileName,
      needPadding
  ) {
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div :id="domId" :style="boxStyle">
          <a :href="fileUrl" :download="fileName" target="_blank">{{ btnLabel }}</a>
        </div>
      `,
        data() {
          return {
            domId: domId,
            btnLabel: btnLabel || "",
            fileUrl: fileUrl || "",
            fileName: fileName || "",
          };
        },
        computed: {
          boxStyle() {
            let paddingStyle = {
              padding: "10px",
            };
            return Object.assign({}, needPadding ? paddingStyle : {});
          },
        },
      },
      selector: document.getElementById(domId), // 平台表单的预留格子的dom
    });
  };

  /**
   * 替换格子生成普通按钮
   * @param selector
   * @param btnLabel
   * @param buttonType text --- 链接按钮 primary --- 主按钮 info --- 提示按钮 success --- 成功按钮 warning --- 警告按钮 error ---错误按钮
   * @param size large、small、mini、default
   * @param clickCallback () => {}
   */
  this.sInfo_renderBtn = function (params) {
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
                <div :id="domId" :style="boxStyle">
                  <sg-button :type="buttonType" :size="size" outline @click="handleClick">{{ btnLabel }}</sg-button>
                </div>
              `,
        data() {
          return {
            domId: params.domId,
            btnLabel: params.btnLabel || "",
            buttonType: params.buttonType || "",
            size: params.size || "",
          };
        },
        computed: {
          boxStyle() {
            let paddingStyle = {
              padding: "10px",
            };
            return paddingStyle;
          },
        },
        methods: {
          handleClick() {
            params.clickCallback();
          },
        },
      },
      selector: document.getElementById(params.domId), // 平台表单的预留格子的dom
    });
  };

  /**
   * 行内无编辑模式渲染图片
   * @param imgUrl
   * @param imgHeight
   * @param label
   */
  this.sInfo_subFromReplacePic = function (imgSrc, imgHeight, label) {
    if (!imgHeight) {
      imgHeight = "48px";
    }
    if (!label) {
      label = "规划条件核实测量";
    }
    return {
      template: `
    <div style="text-align: center; width: 100%;">
      <img v-if="imgSrc" :src="imgSrc" :style="'height:'+imgHeight+';margin-bottom: 14px'"></img>
      <div style="font-size: 14px; color: #333333;">{{ label }}</div>
    </div>
  `,
      data() {
        return {
          imgSrc: imgSrc,
          imgHeight: imgHeight,
          label: label,
        };
      },
    };
  };
  /**
   * 行内编辑替换成单行文本
   * @param mainLabel
   * @param subLabel
   */
  this.sInfo_subFromReplaceSingleText = function (mainLabel) {
    return {
      template: `
    <div style="width:100%;text-align:left;font-size: 14px;">
      <div style="color: #333333;">{{ mainLabel }}</div>
    </div>
  `,
      data() {
        return {
          mainLabel: mainLabel,
        };
      },
    };
  };
  /**
   * 行内编辑替换成最多双行展示文本，显示不下省略号
   * @param mainLabel
   * @param subLabel
   */
  this.sInfo_subFromReplaceDoubleRowText = function (mainLabel) {
    return {
      template: `
    <div style="width:100%;text-align:left;font-size: 14px;">
      <div style="color: #333333;text-overflow: ellipsis; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; display: -webkit-box; white-space: normal;">{{ mainLabel }}</div>
    </div>
  `,
      data() {
        return {
          mainLabel: mainLabel,
        };
      },
    };
  };
  /**
   * 行内编辑替换单格勾选框
   * @param mainLabel
   * @param subLabel
   */
  this.sInfo_subFromReplaceSingleCheckBox = function (param) {
    let {
      checkValue,
      checkCallBack,
      callBackParams,
      disabled = false,
      ...other
    } = param;
    return {
      template: `
    <div style="width:100%;text-align:left;font-size: 14px;">
        <sg-checkbox v-model="checkValue" @on-change="handleCheckChange"  :disabled="disabled">
           <span class="sg-checkbox-label"></span>
        </sg-checkbox>
    </div>
  `,
      data() {
        return {
          checkValue: checkValue,
          disabled: disabled,
        };
      },
      methods: {
        handleCheckChange(val) {
          checkCallBack(val, callBackParams);
        },
      },
    };
  };
  /**
   * 行内编辑替换成双行文本
   * @param mainLabel
   * @param subLabel
   */
  this.sInfo_subFromReplaceDoubleText = function (mainLabel, subLabel) {
    return {
      template: `
    <div style="width:100%;text-align:left;font-size: 14px; word-break: break-all; white-space: normal;">
      <div style="color: #333333;">{{ mainLabel }}</div>
      <div style="color: #999999; padding-top: 20px;">{{ subLabel }}</div>
    </div>
  `,
      data() {
        return {
          mainLabel: mainLabel,
          subLabel: subLabel,
        };
      },
    };
  };

  /**
   * 行内编辑修改文本颜色
   * @param type
   * @param label
   */
  this.sInfo_subFromChangeTextStyle = function (type, label) {
    return {
      template: `
    <div style="width:100%;text-align: left">
      <div :style="baseStyle+(typeStyle[type] || '')">{{ label }}</div>
    </div>
  `,
      data() {
        return {
          baseStyle:
              "height: 22px; border-radius: 2px; font-size: 14px; line-height: 1; display: inline-flex; padding: 5px;",
          typeStyle: {
            yellow: "background: #FCF2DF; color: #EAAC44;",
            red: "background: #FEF2F2; color: #DE2525;",
            black: "background: #EFEFEF; color: #333333;",
            blue: "background: #F2F9FE; color: #2B84E0;",
            yellowNotBg: "color: #EAAC44;",
            redNotBg: "color: #DE2525;",
            blackNotBg: "color: #333333;",
            blueNotBg: " color: #2B84E0;",
            greenNotBg: "color: #2AB787;",
          },
          type: type,
          label: label,
        };
      },
    };
  };

  /**
   * 行内编辑替换文件控件
   * @param btnLabel
   * @param fileUrl
   * @param fileName
   * @param showUnderline
   * @param ellipsis
   */
  this.sInfo_subFromReplaceFileCtrl = function (
      btnLabel,
      fileUrl,
      fileName,
      showUnderline,
      ellipsis
  ) {
    return {
      template: `
    <div :style="boxStyle">
      <a v-if="fileUrl" :href="fileUrl" :download="fileName" target="_blank" :style="aTagStyle" :title="btnLabel">{{ btnLabel }}</a>      
      <div v-else >/</div>
    </div>
  `,
      data() {
        return {
          showUnderline: showUnderline,
          ellipsis: ellipsis,
          btnLabel: btnLabel || "",
          fileUrl: fileUrl || "",
          fileName: fileName || "",
        };
      },
      computed: {
        boxStyle() {
          let ellipsisStyle = {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "#2d8cf0",
          };
          return Object.assign(
              {
                width: "100%",
                textAlign: "left",
                lineHeight: "20px",
                wordBreak: "break-all",
                whiteSpace: "normal",
              },
              this.ellipsis ? ellipsisStyle : {}
          );
        },
        aTagStyle() {
          let underlineStyle = {
            textDecoration: "none",
            borderBottom: "1px solid #2d8cf0",
          };
          return Object.assign({}, this.showUnderline ? underlineStyle : {});
        },
      },
    };
  };

  /**
   * 行内编辑替换文件控件，多个文件
   * @param {Array<{ fileUrl: String, fileName: String, btnLabel: String }>} fileInfoArr
   * @param showUnderline
   * @param ellipsis
   */
  this.sInfo_subFromReplaceMultiFileCtrl = function (
      fileInfoArr,
      showUnderline,
      ellipsis
  ) {
    return {
      template: `
      <div style='width: 100%;'>
        <div v-for="(item, i) in fileInfoArr" :key="i">
          <div :style="boxStyle">
            <a v-if="item.fileUrl" :href="item.fileUrl" :download="item.fileName" target="_blank" :style="aTagStyle" :title="item.btnLabel">{{ item.btnLabel }}</a>      
            <div v-else >/</div>
          </div>
        </div>
        <div v-if="!fileInfoArr.length" >/</div>
      </div>
    `,
      data() {
        return {
          fileInfoArr: fileInfoArr || [],
          showUnderline: showUnderline,
          ellipsis: ellipsis,
        };
      },
      computed: {
        boxStyle() {
          let ellipsisStyle = {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "#2d8cf0",
          };
          return Object.assign(
              {
                width: "100%",
                textAlign: "left",
                lineHeight: "24px",
              },
              this.ellipsis ? ellipsisStyle : {}
          );
        },
        aTagStyle() {
          let underlineStyle = {
            textDecoration: "none",
            borderBottom: "1px solid #2d8cf0",
          };
          return Object.assign({}, this.showUnderline ? underlineStyle : {});
        },
      },
    };
  };

  /**
   * 行内编辑替换文件控件
   * @param btnLabel
   * @param fileUrl
   * @param fileName
   * @param showUnderline
   * @param ellipsis
   */
  this.sInfo_subFromReplaceFileCtrlNew = function (
      btnLabel,
      fileUrl,
      fileName,
      showUnderline,
      ellipsis
  ) {
    return {
      template: `
    <div :style="boxStyle">
      <a v-if="fileUrl" :href="fileUrl" :download="fileName" target="_blank" :style="aTagStyle" :title="btnLabel">{{ btnLabel }}</a>      
      <div v-else >/</div>
    </div>
  `,
      data() {
        return {
          showUnderline: showUnderline,
          ellipsis: ellipsis,
          btnLabel: btnLabel || "",
          fileUrl: fileUrl || "",
          fileName: fileName || "",
        };
      },
      computed: {
        boxStyle() {
          let ellipsisStyle = {
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
            color: "#2d8cf0",
          };
          return Object.assign(
              {
                width: "100%",
                textAlign: "left",
                lineHeight: "20px",
              },
              this.ellipsis ? ellipsisStyle : {}
          );
        },
        aTagStyle() {
          let underlineStyle = {
            textDecoration: "none",
            borderBottom: "1px solid #2d8cf0",
          };
          return Object.assign({}, this.showUnderline ? underlineStyle : {});
        },
      },
    };
  };

  /**
   * 行内编辑渲染按钮
   * @param aBtn
   */
  this.sInfo_subFromReplaceButton = function (aBtn, iBigNum, size) {
    if(!size){
      size = "mini";
    }
    let aComBtn = [];
    let aMoreBtn = [];
    //2及以下个按钮不显示更多
    //2个以上的按钮，第二个按钮开始放到更多下拉中
    if (aBtn.length <= iBigNum) {
      aComBtn = aBtn;
    } else {
      aComBtn.push(aBtn[0]);
      aMoreBtn = aBtn.splice(1);
    }
    return {
      template: `
    <div class="sinfo_btnGroup">
      <sg-button  v-for="(menu, index) in aComBtn" :key="index" :type="menu.type" :size="size" :outline="menu.outline" @click="menu.clickFun(menu)" style="margin-bottom:10px">{{menu.label}}</sg-button>
      <sg-button v-if="aMoreBtn.length>0" ref="moreBtn" type="info" outline>更多<sg-icon type="iconxiala" /></sg-button>
    </div>
  `,
      created() {
        window.top.IBaseExpressLib.addCssStyle({
          vue: Sgui,
          id: "sinfo_btnGroup", // 样式表id，用于实时更新样式表，不传则默认每次调用时新增样式表
          style: `
        .sinfo_btnGroup {
          width: 100%;
          display: flex;
          flex-direction: column;
        }
        .sinfo_btnGroup .sg-btn {
          border-radius: 4px;
          min-Width: 70px;
          padding: 7px 7px;
          font-size: 14px;
        }
        .sinfo_btnGroup .sg-btn .iconxiala {
          margin: 0 0 0 6px;
          font-size: 12px;
        }
      `, // 样式文本
        });
      },
      data() {
        return {
          aComBtn: aComBtn,
          aMoreBtn: aMoreBtn,
          size: size
        };
      },
      computed: {
        aTagStyle() {
          let underlineStyle = {
            textDecoration: "none",
            boxShadow: "0 1px",
          };
          return this.showUnderline ? underlineStyle : {};
        },
      },
      mounted() {
        if (this.$refs.moreBtn)
          window.top.IBaseExpressLib.createPopperMenu({
            vue: Sgui,
            target: this.$refs.moreBtn.$el, // 挂载的目标dom，这里的演示写法 temp1 是【用谷歌调试工具选择dom后，右键存储为全局变量】得到的
            placement: "bottom", // 弹出位置，支持 'auto' | 'auto-start' | 'auto-end' | 'top' | 'top-start' | 'top-end' | 'bottom' | 'bottom-start' | 'bottom-end' | 'right' | 'right-start' | 'right-end' | 'left' | 'left-start' | 'left-end'
            offset: [0, 4], // 偏移参数，以弹出方向为参考坐标系，第一个为滑行的距离，第二个为距离
            menuList: aMoreBtn, // 菜单数组 支持的状态有 'primary' | 'error' | 'success' | 'warning'
            onClick: (item) => {
              item.clickFun(item);
            }, // 点击菜单时的回调函数
          });
      },
    };
  };
  /**
   * 时间轴
   * @param param 参数对象
   * param = {
   *             maxHeight : '',//最大高度
   *             width : '',//宽度
   *             controlId : "",//替换的dom控件ID
   *             getUrl : "",//get请求的接口地址
   *             getParams : {},//get请求接口参数
   *             timelineType : "",//时间轴类型 不传表示默认左侧时间轴 isDetailModal表示有详情弹窗的时间轴
   *             detailBtnText : "查看详情",//详情页面打开按钮的中文
   *             isDot : false//是否有大图标
   *         }
   */
  this.sInfo_Timeline = function (param) {
    let {
      maxHeight = "",
      width = "",
      controlId = "",
      getUrl = "",
      getParams = {},
      timelineType = "",
      detailBtnText = "查看详情",
      isDot = false,
      ...other
    } = param;
    const { timeline } = window.top.IBaseExpressLib;
    timeline({
      vue: Sgui,
      selector: document.getElementById(controlId), // dom目标，比如平台表单的预留格子的dom
      timelineParams: {
        isDot: isDot,
        detailBtnText: detailBtnText,
        controlId: controlId,
        maxHeight: maxHeight,
        width: width,
        timelineType: timelineType, // 时间轴类型 不传表示默认左侧时间轴 isDetailModal表示有详情弹窗的时间轴
        timelineDataFun: () => {
          return new Promise((resolve, reject) => {
            try {
              // api返回参数说明 children：二级时间轴 active：当前激活状态 expand: 默认展开
              // statusText： 节点状态文案，status 节点文案颜色--缺省代表默认 memo：备注
              const axios = window.top.axios || axios;
              // TODO: 符合格式的接口，上面参数看情况改
              axios({
                method: "get",
                url: getUrl,
                params: getParams,
              })
                  .then((res) => {
                    resolve(res);
                  })
                  .catch((error) => {
                    reject(error);
                  });
            } catch (error) {
              reject(error);
            }
          });
        },
      },
    });
  };

  /**
   * 子表单列头居中
   * @param formNumArr
   * @param colNumArr
   */
  this.setSubFormTitleCenter = function (formNumArr, colNumArr) {
    function setCustomStyle({
                              targetList = [], // 要添加定制样式的dom
                              className = "", // 自定义的样式表名
                              styleStr = "", // 自定义的样式表
                            }) {
      targetList.forEach((el) => {
        el.classList.add(className);
      });
      const style = document.createElement("style");
      document.head.append(style);
      style.textContent = styleStr;
    }

    co.Dom.domIsLoaded(
        () => {
          let clsxSubForm = co.Subform.getCurrPageData(co.subFormMap.CGHJ.table);
          if (clsxSubForm && clsxSubForm.length > 0) {
            return true;
          } else {
            return false;
          }
        },
        null,
        (oParam) => {
          let targetList = [];
          if (!oParam.formNumArr || oParam.formNumArr.length == 0) {
            return;
          }
          for (let i = 0; i < oParam.formNumArr.length; i++) {
            targetList.push(sfSubData[oParam.formNumArr[i]].$el);
          }
          if (!oParam.colNumArr || oParam.colNumArr.length == 0) {
            return;
          }
          let styleStr = ``;
          for (let i = 0; i < oParam.colNumArr.length; i++) {
            styleStr += `
    .custom_center_table thead .sg-table-column-left:nth-child(${oParam.colNumArr[i]})  {
      text-align: center;
    }
    .custom_center_table tbody .sg-table-column-left:nth-child(${oParam.colNumArr[i]})  {
      text-align: center;
    }
    .custom_center_table tbody .sg-table-column-left:nth-child(${oParam.colNumArr[i]}) .rowEdit-content {
      justify-content: center;
    }
  `;
          }
          setCustomStyle({
            // 前三个子表
            targetList: targetList,
            className: "custom_center_table",
            // 实现第三列居中
            styleStr: styleStr,
          });
        },
        { formNumArr: formNumArr, colNumArr: colNumArr }
    );
  };

  /**
   * 纯图片展示或者下载链接
   * @param selector
   * @param domId
   * @param imgList [{fileName, type, url}]
   */
  this.sinfo_replaceToImg = (selector, domId, imgList) => {
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
    <div style="text-align: left; width: 100%; padding: 20px;">
      <div v-for="(item, index) in imgList" :key="index">
        <img v-if="item.type === 'img'" :src="item.url" style="width: 100%; height: auto;"></img>
        <a v-else :href="item.url" :download="item.fileName" target="_blank">{{ item.fileName }}</a>
      </div>
    </div>
  `,
        data() {
          return {
            imgList: imgList,
          };
        },
      },
      selector: selector, // 平台表单的预留格子的dom
    });
  };
  /**
   * 流程结束标志
   * @param selector
   * @param domId
   * @param params
   * @returns {{backgroundImage: string}|{label, domId}}
   */
  this.sinfo_processEndFlag = (selector, domId, params) => {
    let { label, bgImg } = params;
    // 样式表
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sinfo_processEndFlag",
      style: `
      .sinfo_processEndFlag {
        padding-top: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-end;
      }
      
      .sinfo_processEndFlag .bgImg {
        width: 106px;
        height: 106px;
      }
      
      .sinfo_processEndFlag .sinfo_processEndFlagLabel {
        font-size: 16px;
        color: #333333;
        padding-top: 20px;
      }
      `,
    });
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div class="sinfo_processEndFlag" :id="domId">
          <img :src="bgImg" class="bgImg"></img>
          <div class="sinfo_processEndFlagLabel">
            {{ label }}
          </div>
        </div>
      `,
        data() {
          return {
            bgImg: bgImg,
            domId: domId,
            label: label, // 等级文本
          };
        },
      },
      selector: selector, // 平台表单的预留格子的dom
    });
  };
  /**
   * 文字替换
   * @param selector
   * @param domId
   * @param params
   * @returns {{backgroundImage: string}|{label, domId}}
   */
  this.sinfo_textReplace = (selector, domId, label) => {
    // 生成组件并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div :id="domId" style="padding-left: 30px">
          <div >
            {{ label }}
          </div>
        </div>
      `,
        data() {
          return {
            domId: domId,
            label: label, // 等级文本
          };
        },
      },
      selector: selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 多个文件上传控件样式替换
   * @typedef {Object} sinfo_uploadFile - 配置参数
   * @property {object} selector - 平台表单的预留格子的dom
   * @property {string} uploadLoadTipTxt - 上传文件ui控件的提示语
   * @property {boolen} showUploadBtn - 是否显示上传按钮
   * @property {boolen} showDeleteBtn - 是否显示删除按钮
   * @property {string} acceptFileType - 上传文件类型限制如：.png, .zip
   * @property {function(): string} getCurrentFileData - 获取当前文件控件数据
   * @property {function(): any} setCurrentFileData - 设置当前文件控件数据到数据库
   * @property {function(): string,string,string} getSInfoWebDownLoadUrl - 拼接文件下载地址
   */
  this.sinfo_uploadMultiFileWithProgress = function (params) {
    const {
      selector,
      uploadLoadTipTxt = "支持png、jpg、jpeg、pdf、word、excel、txt、zip、rar、gif、音频、视频等，最大上传30MB",
      showUploadBtn = true,
      showDeleteBtn = true,
      acceptFileType = "",
      getCurrentFileData,
      setCurrentFileData,
      getSInfoWebDownLoadUrl,
    } = params;
    if (!getCurrentFileData) {
      console.error(
          `uploadMultiFileWithProgress 方法出错，getCurrentFileData 参数不存在`
      );
      return false;
    }
    if (!setCurrentFileData) {
      console.error(
          `uploadMultiFileWithProgress 方法出错，setCurrentFileData 参数不存在`
      );
      return false;
    }
    if (!getSInfoWebDownLoadUrl) {
      console.error(
          `uploadMultiFileWithProgress 方法出错，getSInfoWebDownLoadUrl 参数不存在`
      );
      return false;
    }
    // 样式表
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "uploadMultiFileWithProgress",
      style: `
     .uploadMultiFileWithProgress {
        border: 1px solid #ededed;
        padding: 5px 13px;
        display: flex;
        justify-content: space-between;
     }
     .uploadLoadTip {
       color: #999; 
       font-size: 13px; 
       margin: 12px 0;
     }
     .showFilesList {
       display: flex; 
       width: 60%; 
       position: relative;
     }
     .fileName {
       flex: 1; 
       height: 42px; 
       line-height:42px; 
       white-space: nowrap; 
       overflow: hidden; 
       text-overflow: ellipsis; 
       text-align: left;
     }
     .fileName .sgui-font {
       font-size: 13px; 
       color: #999; 
       margin-right: 10px;
     }
     .fileName .fileLink {
       color: #333;
     }
     .progressWrap {
       width: 120px; 
       display: flex; 
       align-items: center; 
       justify-content: center;
     }
     .progressWrap .sg-progress{
       display: flex; 
       align-items: center; 
       justify-content: right; 
       padding-right: 5px;
     }
     .showFilesListWrap .showFilesList .deleteBtn {
       color: #999; 
       width: 20px; 
       height: 20px;
       font-size: 13px; 
       border: none; 
       position: absolute; 
       right: -16px; 
       top: 43%; 
       transform: translateY(-50%); 
     }
    `,
    });
    // 生成虚拟dom并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div class="uploadMultiFileWithProgress">
          <sg-upload
            v-show="showUploadBtn"
            ref="sinfoCustomerUploadFileStyle"
            name="mFile"
            :accept="accept"
            :data="uploadParams"
            :action="action"
            @on-files-change="changeFiles"
            :on-error="handleOnError"
            :on-success="handleOnSuccess"
            >
            <sg-button type="primary">点击上传</sg-button>
          </sg-upload>
          <p v-if="showUploadBtn" class="uploadLoadTip">{{uploadLoadTipTxt}}</p>
          <div v-if="filesList.length" class="showFilesListWrap">
            <div
              v-for="(file,fileIndex) in filesList"
              :key="fileIndex"
              class="showFilesList"
            >
              <div :title="file.name" class="fileName">
                <sg-icon type="iconwenjianfuwuxiangqing"/>
                <a :href="file.pathUrl" class="fileLink">{{file.name}}</a>
              </div>
              <div v-if="showUploadBtn" class="progressWrap">
                <sg-progress
                  :percent="Math.ceil(file.percentage)"
                />
              </div>
              <sg-button v-if="showDeleteBtn && file.percentage === 100" icon="icondelete" size="mini" class="deleteBtn" @click="deleteFile(file.uid)"></sg-button>
            </div>
          </div>
        </div>
      `,
        data() {
          return {
            showUploadBtn,
            showDeleteBtn,
            accept: acceptFileType,
            filesList: [],
            uploadLoadTipTxt,
            uploadParams: {
              srcType: 0,
              isPreview: true,
            },
            action: "/filemgr/comm/uploadFile",
          };
        },
        mounted() {
          // 初始化filesList
          this.filesList = this.initFilesList();
          this.$refs.sinfoCustomerUploadFileStyle.fileList = this.filesList;
        },
        methods: {
          initFilesList() {
            //获取旧数据
            let newFilesArr = [];
            getCurrentFileData() &&
            (newFilesArr = getCurrentFileData().split("::"));
            return newFilesArr.map((file) => {
              const tmpName = file.split("|")[0];
              const tmpHongPath = file.split("|")[1];
              return {
                uid: Math.random().toString(36).slice(-6),
                name: tmpName,
                response: tmpHongPath,
                percentage: 100,
                pathUrl: getSInfoWebDownLoadUrl(tmpName, tmpHongPath),
              };
            });
          },
          getDownLoadUrl(filesList) {
            return filesList.map((file) => {
              file.pathUrl = getSInfoWebDownLoadUrl(file.name, file.response);
              return file;
            });
          },
          readySaveData(currentFile) {
            const oldFileStr = getCurrentFileData();
            let currentFileStr = currentFile.name + "|" + currentFile.response;
            let newFilesArr = [];
            oldFileStr && (newFilesArr = oldFileStr.split("::"));
            newFilesArr.push(currentFileStr);
            return newFilesArr.join("::");
          },
          saveUpdateData(currentFile) {
            const saveFileData = this.readySaveData(currentFile);
            setCurrentFileData(saveFileData);
          },
          changeFiles(fileList) {
            console.log(
                "咨询投诉上传时候文档改变---",
                fileList,
                this.filesList
            );
            this.filesList = [...this.getDownLoadUrl(fileList)];
            console.log("咨询投诉上传时候文档改变之后的文件", this.filesList);
          },
          handleOnSuccess(res, file, fileList) {
            this.filesList = [...this.getDownLoadUrl(fileList)];
            this.saveUpdateData(file);
          },
          handleOnError(error, res, file) {
            this.$msg.error(res.msg);
          },
          deleteFile(uid) {
            this.deleteFileModal(uid);
          },
          reallyDeleteFile(curUid) {
            const newFilesList = this.filesList.filter(
                (file) => file.uid !== curUid
            );
            this.filesList = [...newFilesList];
            this.$refs.sinfoCustomerUploadFileStyle.fileList = this.filesList;
            // 删除之后，重新保存当前行数据
            const filesDataList = [];
            newFilesList.forEach((_file) => {
              const currentFileStr = _file.name + "|" + _file.response;
              filesDataList.push(currentFileStr);
            });
            setCurrentFileData(filesDataList.join("::"));
          },
          deleteFileModal(uid) {
            const _that = this;
            this.$modal.show({
              closable: true,
              renderContent: () => {
                let { $createElement } = this;
                return $createElement({
                  template: `
                  <div>
                    <div class="sg-modal-header"><div class="sg-modal-header-inner">提示</div></div>
                    <div class="sg-modal-body">确定删除吗?</div>
                    <div class="sg-modal-footer">
                      <sg-button style="background: #3b86e0; color: #fff;" :loading="confirmLoading" @click="onOk">确定</sg-button>
                    </div>
                  </div>
                `,
                  data() {
                    return {
                      confirmLoading: false,
                    };
                  },
                  methods: {
                    async onOk() {
                      try {
                        this.confirmLoading = true;
                        await new Promise((resolve) => {
                          // 调用接口删除数据库中的数据
                          const delFile = _that.filesList.find(
                              (file) => file.uid === uid
                          );
                          console.log("删除文件", delFile);
                          const axios = window.top.axios || axios;
                          axios({
                            method: "post",
                            url: "/filemgr/fileWeb/delFileInfo",
                            data: [delFile.response],
                          })
                              .then(() => {
                                this.$msg.success("删除成功");
                                _that.reallyDeleteFile(uid);
                                resolve();
                                this.confirmLoading = false;
                                this.$modal.remove();
                              })
                              .catch((error) => {
                                console.log(error);
                                this.confirmLoading = false;
                                this.$modal.remove();
                              });
                        });
                      } catch (error) {
                        console.log(error);
                        this.confirmLoading = false;
                        this.$modal.remove();
                      }
                    },
                  },
                });
              },
            });
          },
        },
      },
      selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 单个文件上传控件样式替换（兼容分片和非分片上传版本）
   * @typedef {Object} sinfo_uploadFile - 配置参数
   * @property {object} selector - 平台表单的预留格子的dom
   * @property {boolen} multiple - 是否只能上传单个文件
   * @property {boolen} showUploadBtn - 是否显示上传按钮
   * @property {boolen} showDownLoadBtn - 是否显示下载按钮
   * @property {boolen} showDeleteBtn - 是否显示删除按钮
   * @property {boolen} showPreviewBtn - 是否显示预览按钮
   * @property {boolen} isFileNamePreview - 点击文件名是否是预览 默认下载
   * @property {boolen} previewOpenType - 预览打开方式, 默认弹窗 modal 新标签页 newTab
   * @property {object} uploadParams - 上传文件参数
   * @property {string} acceptFileType - 上传文件类型限制如：".png,.zip"
   * @property {object} zipWhiteInfo - zip白名单如：{zip: ".png,.pdf,.jpg"}
   * @property {function(): string} getCurrentFileData - 获取当前文件控件数据
   * @property {function(): any} setCurrentFileData - 设置当前文件控件数据到数据库
   * @property {function(): string,string,string} getSInfoWebDownLoadUrl - 拼接文件下载地址
   * @property {function(file): Promise<boolean>} beforeUploadRequest - 上传文件前的自定义方法，返回true继续上传，返回false取消上传
   * @property {object} retryConfig - 重试配置 {maxRetries: 3, retryDelay: 2000, retryDelayMultiplier: 2}
   * @property {boolean} enableChunkUpload - 是否启用分片上传，默认false（向后兼容）
   * @property {boolean} enableParallelUpload - 是否启用并行分片上传，默认true（仅在enableChunkUpload=true时有效）
   * @property {number} maxConcurrentChunks - 最大并发分片数量，默认3（避免资源占用过多）
   */
  this.sinfo_uploadSingleFileWithProgress = function (params) {
    const {
      selector,
      controlId,
      multiple = false,
      acceptFileType = "",
      uploadParams = {},
      showUploadBtn = true,
      showDownLoadBtn = true,
      showDeleteBtn = true,
      showPreviewBtn = true,
      getCurrentFileData,
      setCurrentFileData,
      zipWhiteInfo = {},
      getSInfoWebDownLoadUrl,
      previewOpenType = "modal",
      isFileNamePreview = false,
      beforeUploadRequest = null,
      retryConfig = {
        maxRetries: 3,
        retryDelay: 2000,
        retryDelayMultiplier: 2
      },
      enableChunkUpload = false,  // 新增：是否启用分片上传，默认false保证向后兼容
      enableParallelUpload = true,  // 新增：是否启用并行分片上传，默认true
      maxConcurrentChunks = 3  // 新增：最大并发分片数量，默认3
    } = params;
    if (!getCurrentFileData) {
      console.error(
          `sinfo_uploadFileWithProgress 方法出错，getCurrentFileData 参数不存在`
      );
      return false;
    }
    if (!setCurrentFileData) {
      console.error(
          `sinfo_uploadFileWithProgress 方法出错，setCurrentFileData 参数不存在`
      );
      return false;
    }
    // 样式表
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sinfo_uploadFileWithProgress",
      style: `
     .sinfo_uploadSingleFileWithProgress {
        border: 1px solid #ededed;
        padding: 5px 13px;
        display: flex;
        justify-content: space-between;
        min-height: 35px;
      }
      .showFilesListWrap {
        flex: 1;
        padding-right: 8px;
      }
      .showFilesList {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .sg-upload, .custom-upload-wrapper {
        display: flex;
        align-items: center;
      }
      .upload-button {
        background: #3b86e0;
        color: #fff;
        padding: 1px 4px;
        cursor: pointer;
      }
      .upload-button.disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      .sgui-font {
        font-size: 14px !important;
      }
      .upload-status-icon {
        cursor: pointer;
        padding: 1px 4px;
        color: #fff;
        border-radius: 2px;
        margin: 0.5px;
      }
      .delAndDownloadBtn {
        width: 52px;
        display: flex;
        justify-content: space-between;
      }
      .download {
        background: #E0952B;
      }
      .delete {
        background: #DE2525;
      }

      .preview {
        background: #ff4064;
      }
      // 进度条
      .progressWrap {
        width: 160px !important;
      }
      .retry-info {
        font-size: 12px;
        margin-top: 2px;
        color: #f56c6c;
      }
      // 取消a标签下划线
      a:hover {
        text-decoration: none;
      }
    `,
    });
    // 生成虚拟dom并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div class="sinfo_uploadSingleFileWithProgress" :id="controlId">
          <div class="showFilesListWrap">
            <template v-if="filesList.length">
              <div
                v-for="(file,fileIndex) in filesList"
                :key="fileIndex"
                class="showFilesList"
              >
                <div :title="file.name" class="fileName">
                  <a v-if="isFileNamePreview" class="fileLink" @click="handlePreviewPdf(file)">{{file.name}}</a>
                  <a v-else :href="file.pathUrl" class="fileLink" 
                  style="display: -webkit-box;
                    -webkit-box-orient: vertical;
                      -webkit-line-clamp: 2; 
                        overflow: hidden">{{file.name}}</a>
                </div>
                <div v-if="showUploadBtn" class="progressWrap" style="width: 160px;">
                  <sg-progress
                    :percent="Math.ceil(file.percentage)"
                    :status="file.percentage === 100 ? 'success' : (file.status === 'error' ? 'exception' : 'active')"
                  />
                  <!-- 分片上传模式显示分片信息 -->
                  <div v-if="enableChunkUpload && file.totalChunks > 0" class="chunk-info">
                    分片: {{file.uploadedChunks || 0}}/{{file.totalChunks}}
                  </div>
                  <div v-if="file.retryCount > 0" class="retry-info">
                    重试第{{file.retryCount}}次
                  </div>
                </div>
                <!-- <sg-button  icon="icondelete" size="mini" class="deleteBtn" @click="deleteFile(file.uid)"></sg-button> -->
                <div class="delAndDownloadBtn">
                  <template v-if="file.percentage === 100">
                    <sg-tooltip v-if="showDeleteBtn" content="删除" class="upload-status-icon delete" placement="top">
                      <sg-icon type="icondelete" @click.native="deleteFile(file.uid)"></sg-icon>
                    </sg-tooltip>
                    <sg-tooltip v-if="showDownLoadBtn" content="下载" class="upload-status-icon download" placement="top">
                      <a :href="file.pathUrl">
                        <sg-icon type="iconxiazai" color="#fff">
                        </sg-icon>
                      </a>
                    </sg-tooltip>
                    <sg-tooltip v-if="showPreviewBtn" content="预览" class="upload-status-icon preview" placement="top">
                      <sg-icon type="iconpasswordviewfill" color="#fff" @click.native="handlePreviewPdf(file)">
                      </sg-icon>
                    </sg-tooltip>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <!-- 根据enableChunkUpload参数选择上传方式 -->
          <!-- 分片上传：使用原生input -->
          <div v-if="enableChunkUpload" v-show="showUploadBtn" class="custom-upload-wrapper">
            <input 
              type="file" 
              ref="fileInput"
              :accept="accept"
              :multiple="multiple"
              :disabled="!multiple && filesList.length === 1"
              @change="handleFileSelect"
              style="display: none;"
            />
            <sg-tooltip :content="!multiple && filesList.length === 1 ? '请先删除，再上传' : '上传'" placement="top">
              <div :class="['upload-button', {disabled: !multiple && filesList.length === 1}]" @click="triggerFileSelect">
                <sg-icon type="iconshangchuan" />
              </div>
            </sg-tooltip>
          </div>
          <!-- 非分片上传：使用sg-upload组件 -->
          <sg-upload
            v-if="!enableChunkUpload"
            v-show="showUploadBtn"
            ref="sinfo_uploadSingleFileWithProgress"
            name="mFile"
            :accept="accept"
            :data="uploadParams"
            :action="action"
            :disabled="!multiple && filesList.length === 1"
            :on-error="handleOnError"
            :on-success="handleOnSuccess"
            @on-files-change="changeFiles"
            >
            <sg-tooltip :content="!multiple && filesList.length === 1 ? '请先删除，再上传' : '上传'" placement="top">
              <div :class="['upload-button', {disabled: !multiple && filesList.length === 1}]">
                <sg-icon type="iconshangchuan" />
              </div>
            </sg-tooltip>
          </sg-upload>
        </div>
      `,
        data() {
          return {
            controlId,
            filesList: [],
            accept: acceptFileType,
            multiple,
            uploadParams,
            showUploadBtn,
            showDownLoadBtn,
            showDeleteBtn,
            showPreviewBtn,
            previewOpenType,
            isFileNamePreview,
            enableChunkUpload,
            enableParallelUpload,
            maxConcurrentChunks,
            action: enableChunkUpload ? "/filemgr/chunk/fileUpload" : "/filemgr/comm/uploadFile", // 根据模式选择接口
            retryConfig,
            uploadingFiles: new Map(), // 存储正在上传的文件信息
            chunkSize: 2 * 1024 * 1024 // 2MB分片大小（与系统一致）
          };
        },
        mounted() {
          // 初始化filesList
          this.filesList = this.initFilesList();
        },
        methods: {
          initFilesList() {
            //获取旧数据
            let newFilesArr = [];
            getCurrentFileData() &&
            (newFilesArr = getCurrentFileData().split("::"));
            return newFilesArr.map((file) => {
              const tmpName = file.split("|")[0];
              const tmpHongPath = file.split("|")[1];
              return {
                uid: Math.random().toString(36).slice(-6),
                name: tmpName,
                response: tmpHongPath,
                percentage: 100,
                pathUrl: getSInfoWebDownLoadUrl(tmpName, tmpHongPath),
              };
            });
          },
          getDownLoadUrl(filesList) {
            return filesList.map((file) => {
              file.pathUrl = getSInfoWebDownLoadUrl(file.name, file.response);
              return file;
            });
          },
          async fileTypeCheck(file, filetTypeList) {
            let rightType = true;
            let fileType = file.name;
            const index = fileType.lastIndexOf(".");
            fileType = fileType.substring(index + 1, fileType.length);
            rightType = filetTypeList.includes(`.${fileType.toLowerCase()}`);
            if (!rightType) {
              this.$msg.warning({
                closable: true,
                content: "上传文件类型不正确哦～",
                duration: 3,
                customClass: "my-demo-msg",
              });
              return rightType;
            } else {
              // 这里只做了zip的判断
              if (fileType.toLowerCase() === "zip" && zipWhiteInfo["zip"]) {
                // 判断是否是zip白名单
                const extList = await this.getZipFiles(file);
                console.log("白名单不存在的文件类型", extList);
                if (extList.length) {
                  window.Vue.prototype.$msg.info(
                      `不支持后缀为${extList.join(",")}的文件！`
                  );
                  return false;
                }
                return true;
              }
              // 如果不是zip文件，直接返回true
              return true;
            }
          },
          handleBeforeUpload(file) {
            console.log("上传文件类型accpet", this.accept);
            // 先检查文件类型
            if (this.accept) {
              const typeCheckResult = this.fileTypeCheck(file, this.accept.split(","));
              if (!typeCheckResult) {
                return false;
              }
            }

            // 如果有自定义上传前方法，则调用
            if (beforeUploadRequest) {
              return beforeUploadRequest(file);
            }

            return true;
          },
          // 新增:触发文件选择（分片上传模式）
          triggerFileSelect() {
            if (!multiple && this.filesList.length >= 1) {
              return; // 单文件模式且已有文件时不允许选择
            }
            this.$refs.fileInput.click();
          },
          // 新增:sg-upload组件的文件变化事件（非分片上传模式）
          changeFiles(fileList) {
            console.log('sg-upload文件变化:', fileList);
            // 使用getDownLoadUrl方法处理文件列表，保持与其他组件一致
            this.filesList = [
              ...this.getDownLoadUrl(
                multiple
                  ? fileList
                  : fileList.length
                    ? [fileList[fileList.length - 1]]
                    : []
              )
            ];
            console.log('sg-upload文件变化后的文件列表:', this.filesList);
          },
          // 新增:sg-upload组件的上传成功事件（非分片上传模式）
          handleOnSuccess(res, file, fileList) {
            console.log('sg-upload上传成功:', res, file, fileList);
            // 更新文件列表，保持与其他组件一致
            this.filesList = [
              ...this.getDownLoadUrl(
                multiple
                  ? fileList
                  : fileList.length
                    ? [fileList[fileList.length - 1]]
                    : []
              )
            ];

            // 保存到数据库
            const uploadedFile = this.filesList.find(f => f.uid === file.uid);
            if (uploadedFile) {
              this.saveUpdateData(uploadedFile);
            }
          },
          // 新增:sg-upload组件的上传失败事件（非分片上传模式）
          handleOnError(error, res, file) {
            console.error('sg-upload上传失败:', error, res, file);
            this.$msg.error('文件上传失败: ' + (res?.msg || error.message || '未知错误'));

            // 从文件列表中移除失败的文件
            this.filesList = this.filesList.filter(f => f.uid !== file.uid);
          },
          // 新增:处理文件选择（仅分片上传模式）
          async handleFileSelect(event) {
            if (!this.enableChunkUpload) {
              console.warn('handleFileSelect只应在分片上传模式下调用');
              return;
            }

            const files = Array.from(event.target.files);
            if (files.length === 0) return;

            console.log('选择文件（分片上传模式）:', files);

            // 文件类型检查
            for (const file of files) {
              if (this.accept) {
                const typeCheckResult = await this.fileTypeCheck(file, this.accept.split(","));
                if (!typeCheckResult) {
                  event.target.value = '';
                  return;
                }
              }

              // 如果有自定义上传前方法，则调用
              if (beforeUploadRequest) {
                const shouldContinue = await beforeUploadRequest(file);
                if (!shouldContinue) {
                  event.target.value = '';
                  return;
                }
              }
            }

            // 为每个文件生成uid并添加到列表
            const newFiles = files.map(file => {
              console.log('处理文件:', {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
              });

              return {
                uid: Math.random().toString(36).slice(-8),
                name: file.name,
                size: file.size,
                raw: file,
                percentage: 0,
                pathUrl: '',
                totalChunks: 0,
                uploadedChunks: 0,
                retryCount: 0,
                status: 'uploading'
              };
            });

            // 单文件模式:替换现有文件;多文件模式:追加文件
            if (!multiple) {
              this.filesList = newFiles;
            } else {
              this.filesList = [...this.filesList, ...newFiles];
            }

            // 开始分片上传
            newFiles.forEach(file => {
              try {
                this.uploadingFiles.set(file.uid, { retryCount: 0 });
                this.uploadFileInChunks(file).catch(error => {
                  console.error('分片上传失败:', error);
                  try {
                    this.handleUploadError(error, null, file);
                  } catch (handleError) {
                    console.error('处理上传错误时出错:', handleError);
                    // 最后的兜底处理
                    this.$msg.error('文件上传失败: ' + (error.message || '未知错误'));
                    this.filesList = this.filesList.filter(f => f.uid !== file.uid);
                  }
                });
              } catch (initError) {
                console.error('初始化上传失败:', initError);
                this.$msg.error('初始化上传失败: ' + initError.message);
              }
            });

            // 清空input，允许重复选择同一文件
            event.target.value = '';
          },
          // 新增:生成文件唯一标识
          generateFileHash(file) {
            // 使用原生文件对象的属性生成一个简单的hash
            const rawFile = file.raw || file;
            const str = rawFile.name + '_' + rawFile.size + '_' + (rawFile.lastModified || Date.now());
            let hash = 0;
            if (str.length === 0) return hash.toString();
            for (let i = 0; i < str.length; i++) {
              const char = str.charCodeAt(i);
              hash = ((hash << 5) - hash) + char;
              hash = hash & hash; // 转换为32位整数
            }
            // 返回16进制hash，并补齐到40位（模拟MD5长度）
            let hexHash = Math.abs(hash).toString(16);
            // 补齐到40位 - 使用固定字符填充，避免重复拼接导致的问题
            const padding = '0123456789abcdef';
            while (hexHash.length < 40) {
              const needed = 40 - hexHash.length;
              const paddingToAdd = padding.repeat(Math.ceil(needed / padding.length)).substring(0, needed);
              hexHash = hexHash + paddingToAdd;
            }
            return hexHash.substring(0, 40);
          },
          // 新增:计算文件MD5或生成唯一标识（与系统格式一致）
          calculateMD5(file) {
            return new Promise((resolve, reject) => {
              try {
                // 生成基础hash（40位16进制字符串）
                const baseHash = this.generateFileHash(file);

                // 获取jid（如果没有就用defaultJid）
                const jid = (window.co && window.co.params && window.co.params.jid) || 'defaultJid';

                // 生成时间戳（格式：2026-1-12-14-49-55）
                const now = new Date();
                const timestamp = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;

                // 组合成系统格式：md5 + $$$ + jid + / + 时间字段 后面有会被解析的地方，所以改为无5个$
                const totalMd5 = baseHash + "$$$$$" + jid + "/" + timestamp;
                resolve(totalMd5);
              } catch (error) {
                reject(error);
              }
            });
          },
          // 新增:分片上传文件（仅分片上传模式）
          async uploadFileInChunks(file) {
            if (!this.enableChunkUpload) {
              throw new Error('分片上传未启用');
            }

            try {
              // 计算文件MD5
              const totalMd5 = await this.calculateMD5(file);
              const rawFile = file.raw || file;
              const chunks = Math.ceil(rawFile.size / this.chunkSize);

              // 更新文件上传状态
              const fileIndex = this.filesList.findIndex(f => f.uid === file.uid);
              if (fileIndex !== -1) {
                this.filesList[fileIndex].percentage = 0;
              }

              let macroPath = '';

              // 初始化进度跟踪
              if (fileIndex !== -1) {
                this.filesList[fileIndex].totalChunks = chunks;
                this.filesList[fileIndex].uploadedChunks = 0;
              }

              if (this.enableParallelUpload) {
                // 并行上传模式（带并发控制和智能重试）
                const actualConcurrency = Math.min(this.maxConcurrentChunks, chunks);
                console.log(`开始并行上传 ${chunks} 个分片，最大并发数: ${actualConcurrency}`);
                
                let uploadResult = await this.uploadChunksWithConcurrencyControl({
                  file,
                  rawFile,
                  chunks,
                  totalMd5,
                  fileIndex,
                  maxConcurrency: actualConcurrency
                });
                
                // 处理失败的分片重试
                let retryCount = 0;
                while (uploadResult.failedChunks.length > 0 && retryCount < this.retryConfig.maxRetries) {
                  retryCount++;
                  const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.retryDelayMultiplier, retryCount - 1);
                  
                  console.log(`有 ${uploadResult.failedChunks.length} 个分片失败，${delay/1000}秒后进行第${retryCount}次重试...`);
                  this.$msg.warning(`有 ${uploadResult.failedChunks.length} 个分片失败，${delay/1000}秒后进行第${retryCount}次重试...`);
                  
                  // 更新UI显示重试信息
                  if (fileIndex !== -1) {
                    this.filesList[fileIndex].retryCount = retryCount;
                    this.$forceUpdate();
                  }
                  
                  await new Promise(resolve => setTimeout(resolve, delay));
                  
                  // 只重试失败的分片
                  const retryResult = await this.uploadChunksWithConcurrencyControl({
                    file,
                    rawFile,
                    chunks,
                    totalMd5,
                    fileIndex,
                    maxConcurrency: actualConcurrency,
                    failedChunks: uploadResult.failedChunks
                  });
                  
                  // 合并结果
                  uploadResult.results = [...uploadResult.results, ...retryResult.results];
                  uploadResult.failedChunks = retryResult.failedChunks;
                }
                
                // 检查是否还有失败的分片
                if (uploadResult.failedChunks.length > 0) {
                  throw new Error(`${uploadResult.failedChunks.length} 个分片上传失败，已达到最大重试次数`);
                }
                
                // 并行上传时，filePath在最后完成的分片中返回（不一定是索引最大的分片）
                // 需要遍历所有分片结果，找到包含filePath的那一片
                console.log('所有分片上传结果:', uploadResult.results.map(r => ({
                  chunk: r.chunk,
                  hasFilePath: !!r.result.filePath
                })));
                
                const resultWithFilePath = uploadResult.results.find(r => r.result && r.result.filePath);
                if (resultWithFilePath) {
                  macroPath = resultWithFilePath.result.filePath;
                  console.log(`在分片 ${resultWithFilePath.chunk + 1} 中找到filePath:`, macroPath);
                } else {
                  console.warn('所有分片结果中都未找到filePath，尝试查找其他字段');
                  // 如果没有filePath，尝试其他可能的字段
                  const anyResult = uploadResult.results.find(r => 
                    r.result && (r.result.macroPath || r.result.path)
                  );
                  if (anyResult) {
                    macroPath = anyResult.result.macroPath || anyResult.result.path;
                    console.log('找到备用路径字段:', macroPath);
                  }
                }
              } else {
                // 串行上传模式（支持失败分片重试）
                console.log(`开始串行上传 ${chunks} 个分片`);
                
                const chunkResults = new Map();
                const failedChunks = [];
                
                // 第一次尝试上传所有分片
                for (let chunk = 0; chunk < chunks; chunk++) {
                  try {
                    const result = await this.uploadSingleChunk(chunk, rawFile, file, chunks, totalMd5, fileIndex);
                    chunkResults.set(chunk, result);
                    
                    // 检查是否返回了filePath（通常在最后一片）
                    if (result.filePath) {
                      macroPath = result.filePath;
                      console.log(`在分片 ${chunk + 1}/${chunks} 中获取到filePath:`, macroPath);
                    }
                  } catch (error) {
                    console.error(`分片 ${chunk + 1}/${chunks} 上传失败:`, error);
                    failedChunks.push(chunk);
                  }
                }
                
                // 重试失败的分片
                let retryCount = 0;
                while (failedChunks.length > 0 && retryCount < this.retryConfig.maxRetries) {
                  retryCount++;
                  const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.retryDelayMultiplier, retryCount - 1);
                  
                  console.log(`有 ${failedChunks.length} 个分片失败，${delay/1000}秒后进行第${retryCount}次重试...`);
                  this.$msg.warning(`有 ${failedChunks.length} 个分片失败，${delay/1000}秒后进行第${retryCount}次重试...`);
                  
                  // 更新UI显示重试信息
                  if (fileIndex !== -1) {
                    this.filesList[fileIndex].retryCount = retryCount;
                    this.$forceUpdate();
                  }
                  
                  await new Promise(resolve => setTimeout(resolve, delay));
                  
                  // 重试失败的分片
                  const currentFailedChunks = [...failedChunks];
                  failedChunks.length = 0; // 清空失败列表
                  
                  for (const chunk of currentFailedChunks) {
                    try {
                      const result = await this.uploadSingleChunk(chunk, rawFile, file, chunks, totalMd5, fileIndex);
                      chunkResults.set(chunk, result);
                      
                      // 检查是否返回了filePath
                      if (result.filePath) {
                        macroPath = result.filePath;
                        console.log(`在重试的分片 ${chunk + 1}/${chunks} 中获取到filePath:`, macroPath);
                      }
                    } catch (error) {
                      console.error(`分片 ${chunk + 1}/${chunks} 重试失败:`, error);
                      failedChunks.push(chunk);
                    }
                  }
                }
                
                // 检查是否还有失败的分片
                if (failedChunks.length > 0) {
                  throw new Error(`${failedChunks.length} 个分片上传失败，已达到最大重试次数`);
                }
                
                // 如果还没有获取到macroPath，遍历所有结果查找
                if (!macroPath) {
                  console.log('串行上传完成但未获取到filePath，遍历所有结果查找...');
                  for (const [chunk, result] of chunkResults.entries()) {
                    if (result && result.filePath) {
                      macroPath = result.filePath;
                      console.log(`在分片 ${chunk + 1}/${chunks} 的结果中找到filePath:`, macroPath);
                      break;
                    }
                  }
                }
              }

              // 按照Java代码逻辑处理上传完成
              if (macroPath) {
                file.response = macroPath;
                file.macroPath = macroPath;
                file.fileName = file.name;
                file.percentage = 100;
                file.status = 'success';

                this.saveUpdateData(file);
                this.uploadingFiles.delete(file.uid);

                // 更新文件列表中的下载地址
                if (fileIndex !== -1) {
                  this.filesList[fileIndex].pathUrl = getSInfoWebDownLoadUrl(file.name, macroPath);
                  this.filesList[fileIndex].response = macroPath;
                  this.$forceUpdate();
                }

                console.log('分片上传完成:', file.name, 'macroPath:', macroPath);
                return { success: true, macroPath };
              } else {
                // 按照Java代码逻辑:如果所有分片上传完但没有返回宏路径，需要重新上传
                console.error('所有分片上传完成但未获取到文件路径，需要重新上传');
                throw new Error('网络原因上传出错，请重新上传');
              }

            } catch (error) {
              console.error('分片上传失败:', error);
              const fileIndex = this.filesList.findIndex(f => f.uid === file.uid);
              if (fileIndex !== -1) {
                this.filesList[fileIndex].status = 'error';
                this.$forceUpdate();
              }
              throw error;
            }
          },
          // 新增:并发控制的分片上传（支持失败分片重试）
          async uploadChunksWithConcurrencyControl({ file, rawFile, chunks, totalMd5, fileIndex, maxConcurrency, failedChunks = null }) {
            let completedChunks = failedChunks ? chunks - failedChunks.length : 0;
            const results = [];
            const chunkStatus = failedChunks ? new Map() : new Map(); // 跟踪每个分片的状态
            
            // 如果是重试，只处理失败的分片
            const chunksToUpload = failedChunks || Array.from({ length: chunks }, (_, i) => i);
            console.log(`需要上传的分片:`, chunksToUpload);
            
            // 使用信号量控制并发
            const semaphore = {
              count: maxConcurrency,
              waiters: [],
              
              async acquire() {
                if (this.count > 0) {
                  this.count--;
                  return;
                }
                
                return new Promise(resolve => {
                  this.waiters.push(resolve);
                });
              },
              
              release() {
                if (this.waiters.length > 0) {
                  const resolve = this.waiters.shift();
                  resolve();
                } else {
                  this.count++;
                }
              }
            };

            // 创建分片上传任务
            const uploadChunkWithSemaphore = async (chunk) => {
              await semaphore.acquire();
              
              try {
                const start = chunk * this.chunkSize;
                const end = Math.min(start + this.chunkSize, rawFile.size);
                const chunkFile = rawFile.slice(start, end);
                
                if (!chunkFile || chunkFile.size === 0) {
                  throw new Error(`分片 ${chunk + 1} 创建失败`);
                }

                // 验证分片大小
                const expectedSize = Math.min(this.chunkSize, rawFile.size - start);
                if (chunkFile.size !== expectedSize) {
                  throw new Error(`分片 ${chunk + 1} 大小异常: 期望 ${expectedSize}, 实际 ${chunkFile.size}`);
                }

                const result = await this.uploadChunk({
                  file: chunkFile,
                  originalFile: file,
                  chunk,
                  chunks,
                  totalMd5,
                  fileName: rawFile.name,
                  fileSize: rawFile.size
                });

                // 标记分片成功
                chunkStatus.set(chunk, 'success');
                
                // 更新进度
                completedChunks++;
                if (fileIndex !== -1) {
                  this.filesList[fileIndex].uploadedChunks = completedChunks;
                  this.filesList[fileIndex].percentage = Math.round((completedChunks / chunks) * 100);
                  this.$forceUpdate();
                }
                
                console.log(`分片 ${chunk + 1}/${chunks} 上传完成 (并发控制: ${maxConcurrency})`);
                return { chunk, result, status: 'success' };
                
              } catch (error) {
                // 标记分片失败
                chunkStatus.set(chunk, 'failed');
                console.error(`分片 ${chunk + 1}/${chunks} 上传失败:`, error);
                return { chunk, error, status: 'failed' };
              } finally {
                semaphore.release();
              }
            };

            // 创建所有任务并并行执行
            const tasks = [];
            for (const chunk of chunksToUpload) {
              tasks.push(uploadChunkWithSemaphore(chunk));
            }

            // 等待所有任务完成
            const taskResults = await Promise.all(tasks);
            
            // 分离成功和失败的分片
            const successResults = taskResults.filter(r => r.status === 'success');
            const failedResults = taskResults.filter(r => r.status === 'failed');
            
            // 按chunk顺序排序结果
            const sortedResults = successResults.sort((a, b) => a.chunk - b.chunk);
            
            return {
              results: sortedResults,
              failedChunks: failedResults.map(r => r.chunk),
              chunkStatus
            };
          },
          // 新增:上传单个分片（串行模式专用）
          async uploadSingleChunk(chunk, rawFile, file, chunks, totalMd5, fileIndex) {
            const start = chunk * this.chunkSize;
            const end = Math.min(start + this.chunkSize, rawFile.size);
            const chunkFile = rawFile.slice(start, end);
            
            if (!chunkFile || chunkFile.size === 0) {
              throw new Error(`分片 ${chunk + 1} 创建失败`);
            }

            // 验证分片大小
            const expectedSize = Math.min(this.chunkSize, rawFile.size - start);
            if (chunkFile.size !== expectedSize) {
              throw new Error(`分片 ${chunk + 1} 大小异常: 期望 ${expectedSize}, 实际 ${chunkFile.size}`);
            }

            const result = await this.uploadChunk({
              file: chunkFile,
              originalFile: file,
              chunk,
              chunks,
              totalMd5,
              fileName: rawFile.name,
              fileSize: rawFile.size
            });

            // 更新进度
            if (fileIndex !== -1) {
              this.filesList[fileIndex].uploadedChunks = chunk + 1;
              this.filesList[fileIndex].percentage = Math.round(((chunk + 1) / chunks) * 100);
              this.$forceUpdate();
            }

            console.log(`分片 ${chunk + 1}/${chunks} 上传完成`);
            return result;
          },
          // 新增:上传单个分片（仅分片上传模式）
          uploadChunk({ file, originalFile, chunk, chunks, totalMd5, fileName, fileSize }) {
            if (!this.enableChunkUpload) {
              return Promise.reject(new Error('分片上传未启用'));
            }

            return new Promise((resolve, reject) => {
              try {
                // 检查FormData支持
                if (typeof FormData === 'undefined') {
                  throw new Error('浏览器不支持FormData');
                }

                // 创建新的 FormData 实例
                const formData = new FormData();
                console.log('1. 创建FormData实例:', formData);
                console.log('1.1 FormData构造函数:', FormData);
                console.log('1.2 formData原型:', Object.getPrototypeOf(formData));

                // 验证文件对象
                console.log('2. 验证分片文件对象:', {
                  isBlob: file instanceof Blob,
                  isFile: file instanceof File,
                  size: file.size,
                  type: file.type,
                  constructor: file.constructor.name
                });

                // 关键验证：确认传入的file是分片还是完整文件
                console.log('=== 关键验证 ===');
                console.log('当前分片索引:', chunk);
                console.log('传入file大小:', file.size);
                console.log('原始文件大小:', fileSize);
                console.log('file是否等于原始文件大小:', file.size === fileSize);
                console.log('期望的分片大小:', chunk === chunks - 1 ? fileSize % this.chunkSize || this.chunkSize : this.chunkSize);

                if (file.size === fileSize && chunks > 1) {
                  console.error('严重错误：传入uploadChunk的file大小等于原始文件大小！');
                  console.error('这意味着没有正确进行分片切割！');
                }

                if (!file || !(file instanceof Blob) || file.size === 0) {
                  throw new Error(`无效的文件分片: size=${file?.size}, type=${file?.constructor?.name}`);
                }

                // 逐个添加参数并验证
                console.log('3. 开始添加参数到FormData...');

                formData.append('chunk', chunk);
                console.log('3.1 添加chunk:', chunk, '当前FormData条目数:', [...formData.entries()].length);

                formData.append('chunkSize', this.chunkSize);
                console.log('3.2 添加chunkSize:', this.chunkSize, '当前FormData条目数:', [...formData.entries()].length);

                formData.append('size', fileSize);
                console.log('3.3 添加size:', fileSize, '当前FormData条目数:', [...formData.entries()].length);

                formData.append('name', fileName);
                console.log('3.4 添加name:', fileName, '当前FormData条目数:', [...formData.entries()].length);

                formData.append('chunks', chunks);
                formData.append('totalMd5', totalMd5);
                formData.append('srcType', 0);

                // 添加prefixFolder参数(从uploadParams中获取)
                const prefixFolder = this.uploadParams.prefixFolder || '/default/default/default_default';
                formData.append('prefixFolder', prefixFolder);

                // 最后添加文件(按照Java代码的顺序)
                // 使用原始文件名，让服务器通过参数识别分片
                // 注意：不要修改文件名，服务器根据chunk、chunks、totalMd5等参数来识别分片
                formData.append('file', file, fileName);
                console.log('分片文件名（保持原始）:', fileName);

                console.log('4. 所有参数添加完成，最终FormData条目数:', [...formData.entries()].length);
                console.log('5. FormData所有条目:');
                for (let [key, value] of formData.entries()) {
                  if (key === 'file') {
                    console.log(`   ${key}:`, value.constructor.name, value.size + ' bytes');
                  } else {
                    console.log(`   ${key}:`, value);
                  }
                }

                console.log('分片上传参数:', {
                  chunk, chunkSize: this.chunkSize, size: fileSize,
                  name: fileName, chunks, totalMd5,
                  srcType: 0, prefixFolder,
                  fileSize: file.size,
                  fileType: file.type
                });

                // 调试FormData内容
                console.log('FormData详细内容:');
                let formDataEntries = [];
                for (let [key, value] of formData.entries()) {
                  if (key === 'file') {
                    const fileInfo = {
                      type: value.constructor.name,
                      size: value.size,
                      fileType: value.type || 'unknown'
                    };
                    console.log(`${key}:`, fileInfo);
                    formDataEntries.push([key, fileInfo]);
                  } else {
                    console.log(`${key}:`, value, typeof value);
                    formDataEntries.push([key, value]);
                  }
                }

                console.log('FormData 条目总数:', formDataEntries.length);
                console.log('FormData 是否为空:', formDataEntries.length === 0);

                // 验证关键参数
                const hasFile = formDataEntries.some(([key]) => key === 'file');
                const hasChunk = formDataEntries.some(([key]) => key === 'chunk');
                console.log('包含文件:', hasFile);
                console.log('包含分片索引:', hasChunk);

                // 使用与成功请求相同的axios实例和配置
                const axios = window.top.axios || window.axios;
                if (!axios) {
                  reject(new Error('axios未找到'));
                  return;
                }

                // 确保使用正确的baseURL和配置
                console.log('当前axios配置:', {
                  baseURL: axios.defaults?.baseURL,
                  timeout: axios.defaults?.timeout,
                  headers: axios.defaults?.headers,
                  transformRequest: axios.defaults?.transformRequest,
                  interceptorsCount: {
                    request: axios.interceptors?.request?.handlers?.length || 0,
                    response: axios.interceptors?.response?.handlers?.length || 0
                  }
                });

                // 模拟成功请求的环境
                console.log('当前页面URL:', window.location.href);
                console.log('期望的来源URL应该类似:', 'http://192.168.20.30/formdesigner-web/generateForm.html');

                console.log('发送请求到:', this.action);
                console.log('请求方法: POST');
                console.log('FormData 大小:', formData);

                // 重要修复：确保 FormData 正确传输
                const config = {
                  method: 'post',
                  url: this.action,
                  data: formData,
                  timeout: 300000, // 5分钟超时
                  headers: {
                    // 完全不设置 Content-Type，让浏览器自动处理
                  },
                  // 明确设置transformRequest，防止axios默认处理破坏FormData
                  transformRequest: [(data) => data]
                };

                console.log('axios 配置:', config);
                console.log('即将发送请求，请在Network面板检查请求头是否包含正确的Content-Type');

                // 简化版本：直接使用 axios
                console.log('6. 准备发送请求，最终检查FormData:');
                console.log('   FormData实例:', formData);
                console.log('   FormData条目数:', [...formData.entries()].length);
                console.log('   config.data === formData:', config.data === formData);

                debugger; // 在这里检查 formData 是否有数据

                // 直接使用原生XMLHttpRequest发送请求（避免axios拦截器问题）
                console.log('使用原生XMLHttpRequest发送请求');
                const xhr = new XMLHttpRequest();

                // 构建完整的URL
                const requestUrl = this.action;
                console.log('XHR请求URL:', requestUrl);

                xhr.open('POST', requestUrl, true);

                // 不要手动设置 Content-Type，让浏览器自动设置（包括boundary）
                // xhr.setRequestHeader('Content-Type', 'multipart/form-data'); // 不要这样做！

                xhr.onload = function() {
                  console.log('XHR请求完成，状态码:', xhr.status);
                  console.log('XHR响应文本:', xhr.responseText);

                  if (xhr.status === 200) {
                    try {
                      const response = JSON.parse(xhr.responseText);
                      console.log('XHR响应数据:', response);

                      // 检查服务器是否错误地返回了完整文件
                      if (response.filePath && chunk < chunks - 1) {
                        console.warn(`警告: 分片 ${chunk + 1}/${chunks} 返回了filePath，这通常只应该在最后一片返回！`);
                        console.warn('服务器可能将分片误判为完整文件！');
                      }

                      if (response.success === true) {
                        console.log(`分片 ${chunk + 1}/${chunks} 上传成功`);
                        resolve(response);
                      } else {
                        const errorMsg = response.message || response.msg || '上传失败';
                        console.error('XHR上传业务失败:', errorMsg);
                        reject(new Error(errorMsg));
                      }
                    } catch (e) {
                      console.error('XHR解析响应失败:', e);
                      reject(new Error('解析响应失败: ' + e.message));
                    }
                  } else {
                    console.error('XHR HTTP错误:', xhr.status, xhr.statusText);
                    reject(new Error('HTTP错误: ' + xhr.status + ' ' + xhr.statusText));
                  }
                };

                xhr.onerror = function() {
                  console.error('XHR网络错误');
                  reject(new Error('网络错误'));
                };

                xhr.ontimeout = function() {
                  console.error('XHR请求超时');
                  reject(new Error('请求超时'));
                };

                xhr.timeout = 300000; // 5分钟超时

                console.log('即将发送XHR请求，FormData条目数:', [...formData.entries()].length);
                console.log('===== 请在Network面板查看请求详情 =====');
                console.log('期望看到: Content-Type: multipart/form-data; boundary=...');
                console.log('期望看到: Request Payload 中包含12个字段');

                xhr.send(formData);
                console.log('XHR请求已发送，等待服务器响应...');
                return; // 直接返回，不再执行后续的axios代码

                // 以下代码已弃用（保留作为备份）
                /*
                axios(config)
                  .then(response => {
                  console.log('分片上传响应 - 完整response:', response);
                  console.log('分片上传响应 - response.data:', response.data);
                  console.log('response类型:', typeof response);
                  console.log('response是否有data属性:', 'data' in response);

                  // 智能判断响应格式
                  let responseData;
                  if (response && typeof response === 'object' && 'data' in response) {
                    // 标准 axios 响应格式
                    responseData = response.data;
                  } else {
                    // 直接就是数据
                    responseData = response;
                  }

                  console.log('实际响应数据:', responseData);

                  if (responseData) {
                    if (responseData.success === true) {
                      console.log('分片上传成功');
                      resolve(responseData);
                    } else if (responseData.success === false) {
                      const errorMsg = responseData.message || responseData.msg || '分片上传业务失败，请检查服务器日志';
                      console.error('分片上传业务失败:', errorMsg, responseData);
                      reject(new Error(errorMsg));
                    } else {
                      // 如果没有success字段，但有响应数据，可能是成功的
                      console.log('分片上传响应格式特殊，尝试解析:', responseData);
                      resolve(responseData);
                    }
                  } else {
                    console.error('分片上传响应为空');
                    reject(new Error('服务器响应为空'));
                  }
                }).catch(error => {
                  console.error('分片上传请求失败 - 完整error:', error);
                  console.error('分片上传请求失败 - error.message:', error.message);
                  console.error('分片上传请求失败 - error.response:', error.response);

                  // 详细错误信息
                  if (error.response) {
                    console.error('服务器响应错误:', error.response.status, error.response.data);
                    const errorMsg = error.response.data?.message || error.response.data?.msg || `服务器错误 ${error.response.status}`;
                    reject(new Error(errorMsg));
                  } else if (error.request) {
                    console.error('网络请求失败:', error.request);
                    reject(new Error('网络连接失败，请检查网络'));
                  } else {
                    console.error('请求配置错误:', error.message);
                    reject(new Error(error.message || '请求配置错误'));
                  }
                });
                */
              } catch (error) {
                console.error('构建FormData时出错:', error);
                reject(new Error('构建请求数据失败: ' + error.message));
              }
            });
          },
          // 新增:处理上传错误和重试逻辑
          async handleUploadError(error, res, file) {
            const fileInfo = this.uploadingFiles.get(file.uid) || { retryCount: 0 };

            // 检查是否是网络连接错误或服务器错误
            const isRetryableError = error && (
                (error.message && error.message.includes('ERR_CONNECTION_RESET')) ||
                error.code === 'NETWORK_ERROR' ||
                (error.response && error.response.status === 500) ||  // 500错误也重试
                (res && res.status === 0) ||
                !res
            );

            if (isRetryableError && fileInfo.retryCount < this.retryConfig.maxRetries) {
              fileInfo.retryCount++;
              this.uploadingFiles.set(file.uid, fileInfo);

              const delay = this.retryConfig.retryDelay * Math.pow(this.retryConfig.retryDelayMultiplier, fileInfo.retryCount - 1);

              this.$msg.warning(`网络连接中断，${delay/1000}秒后进行第${fileInfo.retryCount}次重试...`);

              // 延迟后重试
              setTimeout(() => {
                this.retryUpload(file);
              }, delay);
            } else {
              // 重试次数用完或非网络错误
              const errorMsg = res && res.msg ? res.msg : '文件上传失败，请检查网络连接后重试';
              this.$msg.error(errorMsg);
              this.uploadingFiles.delete(file.uid);

              // 从文件列表中移除失败的文件
              this.filesList = this.filesList.filter(f => f.uid !== file.uid);
            }
          },
          // 新增:重试上传（现在主要用于非分片模式，分片模式有内置的智能重试）
          retryUpload(file) {
            console.log(`重试上传文件: ${file.name}`);

            // 更新文件状态显示重试信息
            const fileIndex = this.filesList.findIndex(f => f.uid === file.uid);
            if (fileIndex !== -1) {
              this.filesList[fileIndex].retryCount = this.uploadingFiles.get(file.uid).retryCount;
              this.filesList[fileIndex].status = 'uploading';
              this.$forceUpdate();
            }

            // 根据模式选择重试方式
            if (this.enableChunkUpload) {
              // 分片上传现在有内置的智能重试机制，不需要在这里处理
              // 但如果整个文件上传失败，可以重新开始
              console.log('分片上传重试（完整重新上传）');
              if (fileIndex !== -1) {
                this.filesList[fileIndex].percentage = 0;
                this.filesList[fileIndex].uploadedChunks = 0;
                this.$forceUpdate();
              }
              
              this.uploadFileInChunks(file).catch(error => {
                console.error('重试分片上传失败:', error);
                this.handleUploadError(error, null, file);
              });
            } else {
              // 非分片模式的重试逻辑
              console.warn('非分片模式的重试逻辑待实现');
            }
          },
          readySaveData(currentFile) {
            const oldFileStr = getCurrentFileData();
            // 适配sinfoweb接口返回格式:使用macroPath而不是response
            let currentFileStr = (currentFile.fileName || currentFile.name) + '|' + (currentFile.macroPath || currentFile.response);
            let newFilesArr = [];
            oldFileStr && (newFilesArr = oldFileStr.split("::"));
            newFilesArr.push(currentFileStr);
            return newFilesArr.join("::");
          },
          saveUpdateData(currentFile) {
            const saveFileData = this.readySaveData(currentFile);
            setCurrentFileData(saveFileData);
          },
          deleteFile(uid) {
            this.deleteFileModal(uid);
          },
          reallyDeleteFile(curUid) {
            const newFilesList = this.filesList.filter(
                (file) => file.uid !== curUid
            );
            this.filesList = [...newFilesList];
            // 删除之后，重新保存当前行数据
            const filesDataList = [];
            newFilesList.forEach((_file) => {
              const currentFileStr = _file.name + "|" + _file.response;
              filesDataList.push(currentFileStr);
            });
            setCurrentFileData(filesDataList.join("::"));
          },
          deleteFileModal(uid) {
            const _that = this;
            this.$modal.show({
              closable: true,
              renderContent: () => {
                let { $createElement } = this;
                return $createElement({
                  template: `
                  <div>
                    <div class="sg-modal-header"><div class="sg-modal-header-inner">提示</div></div>
                    <div class="sg-modal-body">确定删除吗?</div>
                    <div class="sg-modal-footer">
                      <sg-button style="background: #3b86e0; color: #fff;" :loading="confirmLoading" @click="onOk">确定</sg-button>
                    </div>
                  </div>
                `,
                  data() {
                    return {
                      confirmLoading: false,
                    };
                  },
                  methods: {
                    async onOk() {
                      try {
                        this.confirmLoading = true;
                        await new Promise((resolve) => {
                          // 调用接口删除数据库中的数据
                          const delFile = _that.filesList.find(
                              (file) => file.uid === uid
                          );
                          const axios = window.top.axios || axios;
                          axios({
                            method: "post",
                            url: "/filemgr/fileWeb/delFileInfo",
                            data: [delFile.response],
                          })
                              .then(() => {
                                this.$msg.success("删除成功");
                                _that.reallyDeleteFile(uid);
                                resolve();
                                this.confirmLoading = false;
                                this.$modal.remove();
                              })
                              .catch((error) => {
                                console.log(error);
                                this.confirmLoading = false;
                                this.$modal.remove();
                              });
                        });
                      } catch (error) {
                        console.log(error);
                        this.confirmLoading = false;
                        this.$modal.remove();
                      }
                    },
                  },
                });
              },
            });
          },
          // 预览
          handlePreviewPdf(file) {
            // 新标签页打开
            const macroPath = this.getURLParameter(file.pathUrl, 'macroPath')
            // const path = macroPath.split('jobfiles%')[1]
            const path = macroPath
            console.log(file.pathUrl, path);
            const pageUrl = `/formdesigner-web/pdf.html?type=preview&path=${file.pathUrl}&macroPath=${macroPath}`
            if (this.previewOpenType === 'newTab') {
              window.top.addTab({
                moduleId: '',
                name: file.name,
                pageUrl
              })
            } else {
              const fileTree = [{ label: file.name, path }]
              $.file({
                operate: 'preview',
                showTree: false,
                fileTree // [{ label: '文件1', path: '%%jobfiles%/202212/1cf9292f-2ef9-4a43-b9c2-52e11e2c46fa/PROJ_TZGGB_FJ/e13bde62-db0a-4df6-b6c3-363d0ce782f3.pdf' }]
              })
            }
          },
          getURLParameter(url, param) {
            const searchParams = new URLSearchParams(new URL(url).search);
            return searchParams.get(param);
          },
          /**
           * 通过jszip包在前端解压zip文件
           * @param zipFile
           */
          getZipFiles(zipFile) {
            const ext = zipFile.name.slice(zipFile.name.lastIndexOf(".") + 1);
            const { JsZip } = window.top.IBaseExpressLib;
            const jszip = new JsZip();
            return new Promise((resolve, reject) => {
              jszip
                  .loadAsync(zipFile)
                  .then((list) => {
                    const value = this.getExtByFiles(list.files, ext);
                    resolve(value);
                  })
                  .catch((err) => {
                    console.log("错误err", err);
                    reject(err);
                  });
            });
          },
          /**
           * 根据文件列表 返回不在白名单内的文件
           * @param files object
           * @param fileExt 文件后缀
           */
          getExtByFiles(files, fileExt) {
            let extList = [];
            function getexList(str) {
              const ext = str.slice(str.lastIndexOf(".") + 1);
              // 大小写兼容处理
              if (
                  !zipWhiteInfo[fileExt]
                      .toString()
                      .toLocaleLowerCase()
                      .split(",")
                      .includes(`.${ext.toLocaleLowerCase()}`)
              ) {
                extList.push(ext);
              }
            }
            for (const filesKey in files) {
              if (files[filesKey].dir) {
                continue;
              }
              const fileName = files[filesKey].name;
              // 兼容乱码
              if (window.encodeURI(fileName.includes("/"))) {
                const filenameArr = fileName.split("/");
                if (
                    filenameArr[filenameArr.length - 1].lastIndexOf(".") !== -1
                ) {
                  getexList(filenameArr[filenameArr.length - 1]);
                }
              } else {
                if (fileName.lastIndexOf(".") !== -1) {
                  getexList(fileName);
                }
              }
            }
            return _.uniq(extList);
          },
        },
      },
      selector, // 平台表单的预留格子的dom
    });
  };



  /**
   * @typedef {Object} sinfo_uploadFile - 配置参数
   * @property {string} controlId - 挂在根元素上的id
   * @property {object} selector - 平台表单的预留格子的dom
   * @property {boolen} multiple - 是否可上传多个文件
   * @property {boolen} disabled - 是否只读，默认 false
   * @property {object} uploadParams - 上传文件参数
   * @property {array} format - 上传图片类型限制如：['gif','jpeg','jpg','png','svg']
   * @property {function(): string} getCurrentFileData - 获取当前文件控件数据
   * @property {function(): any} setCurrentFileData - 设置当前文件控件数据到数据库
   */
  this.sinfo_uploadFileWithImage = function (params) {
    const {
      selector,
      controlId,
      multiple = false,
      disabled = false,
      format = [],
      uploadParams = {},
      getCurrentFileData,
      setCurrentFileData,
      getSInfoWebDownLoadUrl,
    } = params;
    if (!getCurrentFileData) {
      console.error(
          `sinfo_uploadFileWithImage 方法出错，getCurrentFileData 参数不存在`
      );
      return false;
    }
    if (!setCurrentFileData) {
      console.error(
          `sinfo_uploadFileWithImage 方法出错，setCurrentFileData 参数不存在`
      );
      return false;
    }
    // 样式表
    let style = ``;
    if (disabled) {
      style += `
      .sinfo_uploadFileWithImage .upload-status-icon.with-delete {
        display: none !important;
      }

      .sinfo_uploadFileWithImage .sg-upload-list-image li:last-child {
        display: none !important;
      }
    `;
    }
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sinfo_uploadFileWithImage",
      style: style,
    });
    // 生成虚拟dom并挂载
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
        <div class="sinfo_uploadFileWithImage" :id="controlId">
          <sg-upload
            ref="sinfo_uploadFileWithImage"
            name="mFile"
            image-upload
            show-preview-mask
            show-upload-list
            upload-list-type="image"
            :multiple="multiple"
            :format="format"
            :data="uploadParams"
            :action="action"
            :on-error="handleOnError"
            :on-success="handleOnSuccess"
            :on-remove="deleteFile"
            @on-files-change="changeFiles"
            >
          </sg-upload>
        </div>
      `,
        data() {
          return {
            controlId,
            filesList: [],
            format,
            multiple,
            uploadParams,
            action: "/filemgr/comm/uploadFile",
          };
        },
        mounted() {
          this.filesList = this.initFilesList();
          this.$refs.sinfo_uploadFileWithImage.fileList = this.filesList;
        },
        methods: {
          initFilesList() {
            //获取旧数据
            let newFilesArr = [];
            getCurrentFileData() &&
            (newFilesArr = getCurrentFileData().split("::"));
            return newFilesArr.map((file) => {
              const tmpName = file.split("|")[0];
              const tmpHongPath = file.split("|")[1];
              return {
                uid: Math.random().toString(36).slice(-6),
                name: tmpName,
                response: tmpHongPath,
                url: getSInfoWebDownLoadUrl(tmpName, tmpHongPath),
              };
            });
          },
          getDownLoadUrl(filesList) {
            return filesList.map((file) => {
              file.pathUrl = getSInfoWebDownLoadUrl(file.name, file.response);
              return file;
            });
          },
          readySaveData(currentFile) {
            const oldFileStr = getCurrentFileData();
            let currentFileStr = currentFile.name + "|" + currentFile.response;
            let newFilesArr = [];
            if (oldFileStr && multiple) newFilesArr = oldFileStr.split("::");
            newFilesArr.push(currentFileStr);
            return newFilesArr.join("::");
          },
          saveUpdateData(currentFile) {
            const saveFileData = this.readySaveData(currentFile);
            setCurrentFileData(saveFileData);
          },
          changeFiles(fileList) {
            console.log("上传单个文件改变之前---", fileList, this.filesList);
            this.filesList = [
              ...this.getDownLoadUrl(
                  multiple
                      ? fileList
                      : fileList.length
                          ? [fileList[fileList.length - 1]]
                          : []
              ),
            ];
            console.log("上传单个文件改变之后的", this.filesList);
          },
          handleOnSuccess(res, file, fileList) {
            this.$refs.sinfo_uploadFileWithImage.fileList = [file];
            this.saveUpdateData(file);
          },
          handleOnError(error, res, file) {
            this.$msg.error(res.msg);
          },
          deleteFile(file) {
            this.deleteFileModal(file.uid);
            return false;
          },
          reallyDeleteFile(curUid) {
            const newFilesList = this.filesList.filter(
                (file) => file.uid !== curUid
            );
            this.filesList = [...newFilesList];
            this.$refs.sinfo_uploadFileWithImage.fileList = this.filesList;
            // 删除之后，重新保存当前行数据
            const filesDataList = [];
            newFilesList.forEach((_file) => {
              const currentFileStr = _file.name + "|" + _file.response;
              filesDataList.push(currentFileStr);
            });
            setCurrentFileData(filesDataList.join("::"));
          },
          deleteFileModal(uid) {
            const _that = this;
            this.$modal.show({
              closable: true,
              renderContent: () => {
                let { $createElement } = this;
                return $createElement({
                  template: `
                  <div>
                    <div class="sg-modal-header"><div class="sg-modal-header-inner">提示</div></div>
                    <div class="sg-modal-body">确定删除吗?</div>
                    <div class="sg-modal-footer">
                      <sg-button style="background: #3b86e0; color: #fff;" :loading="confirmLoading" @click="onOk">确定</sg-button>
                    </div>
                  </div>
                `,
                  data() {
                    return {
                      confirmLoading: false,
                    };
                  },
                  methods: {
                    async onOk() {
                      try {
                        this.confirmLoading = true;
                        await new Promise((resolve) => {
                          // 调用接口删除数据库中的数据
                          const delFile = _that.filesList.find(
                              (file) => file.uid === uid
                          );
                          const axios = window.top.axios || axios;
                          axios({
                            method: "post",
                            url: "/filemgr/fileWeb/delFileInfo",
                            data: [delFile.response],
                          })
                              .then(() => {
                                this.$msg.success("删除成功");
                                _that.reallyDeleteFile(uid);
                                resolve();
                                this.confirmLoading = false;
                                this.$modal.remove();
                              })
                              .catch((error) => {
                                console.log(error);
                                this.confirmLoading = false;
                                this.$modal.remove();
                              });
                        });
                      } catch (error) {
                        console.log(error);
                        this.confirmLoading = false;
                        this.$modal.remove();
                      }
                    },
                  },
                });
              },
            });
          },
        },
      },
      selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 行内编辑的文件控件样式修改（目前只测试了下载，保存的可能需要调试）
   * @param colValue  获取当前行数据的值，即渲染哪一行，就是该行数据
   * @param tmpSaveData 存当前行数据方法，因为这里没有上传功能不用使用，但是如果出现保存失败，就要使用
   */
  this.sinfo_subFormFileControlReplace = function (colValue, tmpSaveData) {
    return {
      template: `
    <div
      class="sinfo_uploadFileWithProgressHangNei"
    >
      <div class="showFilesListWrap">
        <template v-if="filesList.length">
          <div
            v-for="(file,fileIndex) in filesList"
            :key="fileIndex"
            class="showFilesList"
          >
            <div :title="file.name" class="fileName">
              <a :href="file.pathUrl" class="fileLink">{{file.name}}</a>
            </div>
            <div v-if="showUploadBtn" class="progressWrap" style="width: 160px;">
              <sg-progress
                :percent="Math.ceil(file.percentage)"
              />
            </div>
            <!-- <sg-button  icon="icondelete" size="mini" class="deleteBtn" @click="deleteFile(file.uid)"></sg-button> -->
            <div class="delAndDownloadBtn">
              <template v-if="file.percentage === 100">
                <sg-tooltip v-if="showDeleteBtn" content="删除" class="upload-status-icon delete" placement="top">
                  <sg-icon type="icondelete" @click.native="deleteFile(file.uid)"></sg-icon>
                </sg-tooltip>
                <sg-tooltip v-if="showDownLoadBtn" content="下载" class="upload-status-icon download" placement="top">
                  <a :href="file.pathUrl">
                    <sg-icon type="iconxiazai" color="#fff">
                    </sg-icon>
                  </a>
                </sg-tooltip>
                <sg-tooltip v-if="showPreviewBtn" content="预览" class="upload-status-icon preview" placement="top">
                  <sg-icon type="iconpasswordviewfill" color="#fff" @click.native="handlePreviewPdf(file)">
                  </sg-icon>
                </sg-tooltip>
              </template>
            </div>
          </div>
        </template>
      </div>
      <sg-upload
        v-show="showUploadBtn"
        ref="sinfo_uploadFileWithProgressHangNei"
        name="mFile"
        :accept="accept"
        :data="uploadParams"
        :action="action"
        :disabled="!multiple && filesList.length === 1"
        :on-error="handleOnError"
        :on-success="handleOnSuccess"
        @on-files-change="changeFiles"
        >
        <sg-tooltip :content="!multiple && filesList.length === 1 ? '请先删除，再上传' : '上传'" placement="top">
          <div class="upload-button">
            <sg-icon type="iconshangchuan" />
          </div>
        </sg-tooltip>
      </sg-upload>
    </div>
  `,
      data() {
        return {
          filesList: [],
          accept: "",
          multiple: true,
          uploadParams: {
            // 如果存在上传按钮，就要更改该参数的值
            srcType: 0,
            isPreview: true,
            // fileInfo: JSON.stringify({ taskId: co.params.jid }),
            // prefixFolder: '/' + co.params.jid + '/' + co.params.rid + '/PROJ_CGHJB_WJJSC'
          },
          showUploadBtn: false,
          showDownLoadBtn: true,
          showDeleteBtn: false,
          showPreviewBtn: true,
          action: "/filemgr/comm/uploadFile",
          colValue: colValue,
          style: `
        .sinfo_uploadFileWithProgressHangNei {
          padding: 5px 13px;
          display: flex;
          height: 35px;
          width: 100%;
          position: relative;
          top: 12px;
          border: 1px solid #ededed;
          justify-content: space-between;
        }
        .showFilesListWrap {
          flex: 1;
          padding-right: 8px;
        }
        .showFilesList {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .fileName {
          width: 175px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-right: 5px;
        }
        .sg-upload {
          display: flex;
          align-items: center;
        }
        .upload-button {
          background: #3b86e0;
          color: #fff;
          padding: 1px 4px;
          cursor: pointer;
        }
        .sgui-font {
          font-size: 14px !important;
        }
        .upload-status-icon {
          cursor: pointer;
          padding: 1px 4px;
          color: #fff;
          border-radius: 2px;
        }
        .delAndDownloadBtn {
          // width: 52px;
          display: flex;
          justify-content: space-between;
        }
        .download {
          background: #E0952B;
        }
        .delete {
          background: #DE2525;
        }
        // 进度条
        .progressWrap {
          width: 160px !important;
        }
        // 取消a标签下划线
        a:hover {
          text-decoration: none;
        }
      `,
        };
      },
      mounted() {
        // 挂载样式表
        window.top.IBaseExpressLib.addCssStyle({
          vue: Sgui,
          id: "sinfo_uploadFileWithProgressHangNei",
          style: this.style,
        });
        // 初始化filesList
        this.filesList = this.initFilesList();
        this.$refs.sinfo_uploadFileWithProgressHangNei.fileList =
            this.filesList;
      },
      methods: {
        initFilesList() {
          //获取旧数据
          let newFilesArr = [];
          this.colValue && (newFilesArr = this.colValue.split("::"));
          return newFilesArr.map((file) => {
            const tmpName = file.split("|")[0];
            const tmpHongPath = file.split("|")[1];
            return {
              uid: Math.random().toString(36).slice(-6),
              name: tmpName,
              response: tmpHongPath,
              percentage: 100,
              pathUrl: this.getSInfoWebDownLoadUrl(tmpName, tmpHongPath),
            };
          });
        },
        getDownLoadUrl(filesList) {
          return filesList.map((file) => {
            file.pathUrl = this.getSInfoWebDownLoadUrl(
                file.name,
                file.response
            );
            return file;
          });
        },
        readySaveData(currentFile) {
          const oldFileStr = this.colValue;
          let currentFileStr = currentFile.name + "|" + currentFile.response;
          let newFilesArr = [];
          oldFileStr && (newFilesArr = oldFileStr.split("::"));
          newFilesArr.push(currentFileStr);
          return newFilesArr.join("::");
        },
        saveUpdateData(currentFile) {
          const saveFileData = this.readySaveData(currentFile);
          this.tmpSaveData(saveFileData);
        },
        changeFiles(fileList) {
          this.filesList = [...this.getDownLoadUrl(fileList)];
        },
        handleOnSuccess(res, file, fileList) {
          this.saveUpdateData(file);
        },
        handleOnError(error, res, file) {
          this.$msg.error(res.msg);
        },
        deleteFile(uid) {
          this.deleteFileModal(uid);
        },
        reallyDeleteFile(curUid) {
          const newFilesList = this.filesList.filter(
              (file) => file.uid !== curUid
          );
          this.filesList = [...newFilesList];
          this.$refs.sinfo_uploadFileWithProgressHangNei.fileList =
              this.filesList;
          // 删除之后，重新保存当前行数据
          const filesDataList = [];
          newFilesList.forEach((_file) => {
            const currentFileStr = _file.name + "|" + _file.response;
            filesDataList.push(currentFileStr);
          });
          this.tmpSaveData(filesDataList.join("::"));
        },
        deleteFileModal(uid) {
          const _that = this;
          this.$modal.show({
            closable: true,
            renderContent: () => {
              let { $createElement } = this;
              return $createElement({
                template: `
                <div>
                  <div class="sg-modal-header"><div class="sg-modal-header-inner">提示</div></div>
                  <div class="sg-modal-body">确定删除吗?</div>
                  <div class="sg-modal-footer">
                    <sg-button style="background: #3b86e0; color: #fff;" :loading="confirmLoading" @click="onOk">确定</sg-button>
                  </div>
                </div>
              `,
                data() {
                  return {
                    confirmLoading: false,
                  };
                },
                methods: {
                  async onOk() {
                    try {
                      this.confirmLoading = true;
                      await new Promise((resolve) => {
                        // 调用接口删除数据库中的数据
                        const delFile = _that.filesList.find(
                            (file) => file.uid === uid
                        );
                        const axios = window.top.axios || axios;
                        axios({
                          method: "post",
                          url: "/filemgr/fileWeb/delFileInfo",
                          data: [delFile.response],
                        })
                            .then(() => {
                              this.$msg.success("删除成功");
                              _that.reallyDeleteFile(uid);
                              resolve();
                              this.confirmLoading = false;
                              this.$modal.remove();
                            })
                            .catch((error) => {
                              console.log(error);
                              this.confirmLoading = false;
                              this.$modal.remove();
                            });
                      });
                    } catch (error) {
                      console.log(error);
                      this.confirmLoading = false;
                      this.$modal.remove();
                    }
                  },
                },
              });
            },
          });
        },
        // 预览
        handlePreviewPdf(file) {
          const path = this.getURLParameter(file.pathUrl, 'macroPath')
          const fileTree = [{ label: file.name, path }]
          $.file({
            operate: 'preview',
            showTree: false,
            fileTree // [{ label: '文件1', path: '%%jobfiles%/202212/1cf9292f-2ef9-4a43-b9c2-52e11e2c46fa/PROJ_TZGGB_FJ/e13bde62-db0a-4df6-b6c3-363d0ce782f3.pdf' }]
          })
        },
        getURLParameter(url, param) {
          const searchParams = new URLSearchParams(new URL(url).search);
          return searchParams.get(param);
        },
        //获取sInfoWeb下载地址
        getSInfoWebDownLoadUrl(fileName, macroPath, sInfoUrl) {
          let sReturn = "";
          if (sInfoUrl) {
            sReturn += window.location.origin + "/sinfoweb" + sInfoUrl;
          } else {
            sReturn +=
                window.location.origin +
                "/filemgr/comm/downFileByPath=" +
                encodeURIComponent(macroPath) +
                "&fileName=" +
                fileName;
            // sReturn += window.location.origin +"/sinfoweb/file/public/downFileByPath?macroPath=" + encodeURIComponent(macroPath) + "&fileName=" + fileName;
          }
          return sReturn;
        },
        // 保存方法
        tmpSaveData(ret) {
          if (tmpSaveData) {
            tmpSaveData(ret);
          }
        },
      },
    };
  };

  /**
   * 单行文本特殊文本和样式定制
   * @param params
   */
  this.sinfo_singleLineText = function (params) {
    const { vue, selector, customParams } = { ...(params || {}) };
    let vueComponent = {
      render: (h) => {
        h = vue.$createElement;
        const {
          controlId,
          firstLabel,
          firstLabelStyle,
          secondLabel,
          secondLabelStyle,
          secondLabelType,
          clickCallback,
        } = customParams;
        return h({
          template: `
          <div class="sinfo_singleLine" :id="controlId">
            <div class="firstLabel" :style="firstLabelStyle">{{ firstLabel }}</div>
            <div class="secondLabel" :style="secondLabelStyle">
              <span v-if="secondLabelType === 'a'">
                <a @click="clickCallback">{{ secondLabel }}</a>
              </span>
              <span v-else>{{ secondLabel }}</span>
            </div>
          </div>
        `,
          data() {
            return {
              controlId,
              firstLabel,
              firstLabelStyle,
              secondLabel,
              secondLabelStyle,
              secondLabelType,
              clickCallback,
            };
          },
          created() {
            window.top.IBaseExpressLib.addCssStyle({
              vue,
              id: "sinfo_singleLine", // 样式表id，用于实时更新样式表，不传则默认每次调用时新增样式表
              style: `
              .sinfo_singleLine {
                display: flex;
                padding: 8px 0;
              }

              .sinfo_singleLine .firstLabel {
                color: #404040;
                font-weight: bold;
                font-size: 14px;
              }

              .sinfo_singleLine .secondLabel {
                color: #999;
              }

              .sinfo_singleLine .secondLabel a {
                color: #999;
                text-decoration: underline;
              }
            `, // 样式文本
            });
          },
        });
      },
    };
    window.top.IBaseExpressLib.renderCustomVue({
      vue,
      vueComponent: vueComponent,
      selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 单行显示文字加副文字
   * @param params
   * @returns {{tipsText: *, titleText: *}}
   */
  this.sInfo_singleLintTextWithDesc = function (params) {
    const { selector, titleText, tipsText } = { ...(params || {}) };
    let vueComponent = {
      template: `
    <div style="width: 100%; display: flex; padding: 10px 0;">
      <span>{{ titleText }}</span>
      <sg-tooltip :content="tipsText" placement="right">
        <sg-icon size="14" type="iconinfofill" color="#999" style="margin-left: 2px;"></sg-icon>
      </sg-tooltip>
    </div>
  `,
      data() {
        return {
          titleText: titleText,
          tipsText: tipsText,
        };
      },
    };
    // 控制台测试时用这段
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: vueComponent,
      selector: selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 异常/重点合同状态显示
   * @param params
   * @returns {{reason: *, buttonText: string, statusText: *, domId: *}}
   */
  this.sInfo_abnormalContract = function (params) {
    const { statusText, reason, buttonCallback, selector, domId, isEditable } =
        { ...(params || {}) };
    let vueComponent = {
      template: `
    <div style="font-size: 14px; line-height: 1; padding: 10px; background: #ECF6FF;" :id="domId">
      <div style="padding-bottom: 10px; color: rgb(255, 0, 0);">
        <sg-icon type="iconjinggao" style="margin-left: 4px" />
        <span>{{ statusText }}</span>
        <sg-button v-if="isEditable" type="link" style="float: right; border: none; background: transparent; color: #3b86e0" @click="showContractModal">{{ buttonText }}</sg-button>
      </div>
      <div style="color: #3b86e0;">{{ reason }}</div>
    </div>
  `,
      data() {
        return {
          statusText: statusText,
          reason: reason,
          buttonText: "编辑",
          domId: domId,
          isEditable: isEditable,
        };
      },
      methods: {
        showContractModal() {
          buttonCallback(params);
        },
      },
    };
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: vueComponent,
      selector: selector, // 平台表单的预留格子的dom
    });
  };
  /**
   * 展示异常/重点合同的编辑页面
   * @param params
   */
  this.sInfo_showAbnormalContractEdit = function (params) {
    const {
      title = "标记为重点/异常合同",
      reason = "",
      buttonCallback = () => {},
      closable = true,
    } = { ...(params || {}) };
    Sgui.$modal.confirm({
      render: (h) => {
        h = Sgui.$createElement;
        return h({
          template: `
            <div>
              <sg-form :label-width="100" size="mini" class="event">
                <sg-form-item label="标记原因：">
                  <sg-input v-model="signInfo.reason" type="textarea" placeholder="请输入内容" :autosize="{ minRows: 4, maxRows: 5 }"></sg-input>
                </sg-form-item>
              </sg-form>
              <div class="btn-group" style="margin-top: 20px;text-align: right;">
                <sg-button size="mini" @click="closeModal" style="margin-right: 10px;">取消</sg-button>
                <sg-button type="primary" size="mini" @click="handleClick" style="margin-right: 10px;">确定</sg-button>
              </div>
            </div>
            `,
          data() {
            return {
              signInfo: {
                reason: "",
              },
            };
          },
          async mounted() {
            this.signInfo.reason = reason;
          },
          methods: {
            closeModal() {
              this.$modal.remove();
            },
            handleClick() {
              const res = buttonCallback(this.signInfo);
              // 回调函数返回FALSE时不关闭弹窗
              if (res === false) return;
              this.closeModal();
            },
          },
        });
      },
      title: title,
      closable,
      similar: true,
      width: "500px",
      footerHide: true,
    });
  };
  /**
   * 替换dom或者弹窗展示满意度评价数据
   * @param params
   * @returns {Promise<unknown>}
   * @example
   * sInfo_ShowRateDetail({
   *   modalParams: {
   *     modalType: 'alert',
   *     modalTitle: '评价详情',
   *     confirmCallback: (a) => { console.log(a) },
   *     cancelCallback: (a) => { console.log(a) },
   *     width: '40%',
   *     okText: '关闭'
   *   },
   *   vue: Sgui,
   *   selector: document.getElementById("app1"),
   *   controlId: '',
   *   rateDetail: [{
   *     label: '221323',
   *     value:
   *   }]
   * })
   */
  this.sInfo_ShowRateDetail = function (params) {
    const { renderCustomVue, baseModal } = window.top.IBaseExpressLib;
    const { vue, selector, controlId, rateDetail, modalParams } = {
      ...(params || {}),
    };

    let promiseResolve = null;
    let vueInstance = null;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "rateDetailWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
        <div :id="controlId">
          <sg-row style="display: block;">
            <sg-col class="desc-col" v-for="(option, index) in rateDetail" :key="option.key" style="color: rgba(0 0 0 / 65%); display:flex; line-height: 36px;">
              <template>
                <span class="name" style="width: 150px; border: 1px solid #ededed; border-top: none; background:rgba(241, 245, 248); white-space: nowrap; text-overflow: ellipsis; overflow:hidden; text-align: center;">{{ option.label }}</span>
                <span class="name-value" style="flex:1; padding: 5px; border: 1px solid #ededed; border-left: none; border-top: none; border-right: none; white-space: nowrap; text-overflow: ellipsis; overflow:hidden;">
                  <span v-if="option.type === 'text'" style="display: flex; align-items: center;">
                    <sg-rate v-model="option.value" :disabled="modalParams && modalParams.modalType === 'alert'"/>
                    <span>{{ desc[option.value - 1] }}</span>
                  </span>
                  <sg-input v-if="option.type === 'textarea'" type="textarea" :placeholder="option.label" :autosize="{ minRows: 2,maxRows: 5 }" v-model="option.value" :disabled="modalParams && modalParams.modalType === 'alert'"/>
                  <span v-if="option.type === 'label'"> {{ option.value }}</span>
                </span>
              </template>
            </sg-col>
          </sg-row>
        </div>
        `,
          data() {
            return {
              controlId: controlId,
              desc: ["非常差", "差", "一般", "好", "非常好"],
              rateDetail: rateDetail,
              modalParams,
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      if (modalParams) {
        baseModal({
          vue: vue,
          ...modalParams,
          vueComponent: vueComponent,
          getVueInstance: () => vueInstance,
        });
        return;
      }
      // 挂载模式
      renderCustomVue({
        vue,
        vueComponent,
        selector,
      });
    });
  };
  /**
   * 步骤条dom替换（常熟首用）
   * @param params
   * @returns {{stepsList: *, controlId: *}}
   */
  this.sInfo_RenderCustomVue = function (params) {
    const { renderCustomVue, baseModal } = window.top.IBaseExpressLib;
    const { stepsList, controlId, selector, stepClickCallback } = {
      ...(params || {}),
    };

    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "stepStage",
      style: `
    .stepStage {
      font-size: 14px;
      line-height: 1;
      padding: 52px 20px;
      display: flex;
      position: relative;
      width: 100%;
      justify-content: center;
    }

    .stepStage .stageItem {
      padding: 6px 10px;
      display: flex;
      background: #DAF3FF;
      border-radius: 30px 30px 30px 30px;
      color: #6BB1D1;
      margin-right: 40px;
      position: relative;
    }

    .stepStage .stageItem.stage1 {
      background: #FDF0E3;
      color: #D89755;
    }

    .stepStage .stageItem.stage2 {
      background: #D8F4F1;
      color: #56A163;
    }

    .stepStage .stageItem:last-child:before {
      content: "";
      width: 0px;
      height: 0px;
      border-top: 40px solid transparent;
      border-bottom: 40px solid transparent;
      border-left: 65px solid #DAF3FF;
      position: absolute;
      top: -14px;
      right: -44px;
      border-radius: 20px;
    }

    .stepStage .stageItem.stage1:before {
      border-left: 65px solid #FDF0E3;
    }

    .stepStage .stageItem.stage2:before {
      border-left: 65px solid #D8F4F1;
    }

    .stepStage .stageItem .stepItem {
      position: relative;
      padding-right: 23px;
      cursor: pointer;
    }

    .stepStage .stageItem .stepItem:last-child {
      padding: 0;
    }

    .stepStage .stageItem .stepItem .sortIndex {
      width: 42px; 
      height: 42px; 
      border-radius: 25px 25px 25px 25px; 
      border: 3px dashed #6BB1D1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .stepStage .stageItem .stepItem .sortIndex.finish {
      border: 3px solid #fff;
    }

    .stepStage .stageItem .stepItem .sortIndex .duigou {
      display: inline-block;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      position: relative;
      margin: 0 auto;
    }

    .stepStage .stageItem .stepItem .sortIndex .duigou:after {
      content: "";
      width: 20px;
      height: 10px;
      border: 3px solid #fff;
      border-top: none;
      border-right: none;
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(315deg);
    }

    .stepStage .stageItem .stepItem .currentStep:before {
      content: "";
      width: 0px;
      height: 0px;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid #6BB1D1;
      position: absolute;
      bottom: -6px;
      left: 16px;
    }

    .stepStage .stageItem.stage1 .stepItem .currentStep:before {
      border-bottom: 5px solid #D89755;
    }

    .stepStage .stageItem.stage2 .stepItem .currentStep:before {
      border-bottom: 5px solid #56A163;
    }

    .stepStage .stageItem .stepItem .stepDesc {
      position: absolute;
      width: 120px;
      left: -20px;
      bottom: -35px;
    }

    .stepStage .stageItem .stepItem .stepDesc:before {
      display: block;
      content: "";
      height: 9px;
      width: 3px;
      background-color: #DAF3FF;
      position: absolute;
      left: 40px;
      top: -11px;
    }

    .stepStage .stageItem .stepItem:nth-child(2n) .stepDesc:before {
      top: unset;
      bottom: 48px;
    }

    .stepStage .stageItem.stage1 .stepItem .stepDesc:before {
      background-color: #FDF0E3;
    }

    .stepStage .stageItem.stage2 .stepItem .stepDesc:before {
      background-color: #D8F4F1;
    }

    .stepStage .stageItem .stepItem .stepDesc p {
      margin-bottom: 5px;
    }

    .stepStage .stageItem .stepItem .stepDesc.hasFinishTime {
      bottom: -55px;
    }

    .stepStage .stageItem .stepItem:nth-child(2n) .stepDesc {
      bottom: 0;
      top: -35px;
    }

    .stepStage .stageItem .stepItem:nth-child(2n) .stepDesc.hasFinishTime {
      bottom: 0;
      top: -50px;
    }
  `,
    });

    let vueComponent = {
      template: `
    <div :id="controlId" class="stepStage">
      <div class="stageItem" v-for="(step, index) in stepsList.filter(i => i.length)" :key="index"  :class="'stage' + index">
        <div v-for="(item, ind) in step" :key="item.index" class="stepItem" @click="stepClickCallback(item)">
          <div :class="{'finish': item.status, 'currentStep': step.filter(i => i.status).length === ind }" class="sortIndex">
            <div v-if="!item.status">{{ item.index }}</div>
            <div v-else class="duigou"></div>
          </div>
          <div class="stepDesc" :class="{ 'hasFinishTime': item.finishTime }">
            <p>{{ item.label }}</p>
            <p v-if="item.finishTime">{{ item.finishTime }}</p>
          </div>
        <div>
      </div>
    </div>
  `,
      data() {
        return {
          controlId: controlId,
          stepsList: stepsList,
          stepClickCallback,
        };
      },
      created() {
        console.log(params, controlId, stepClickCallback);
      },
      methods: {},
    };

    // 控制台测试时用这段
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: vueComponent,
      selector: selector, // 平台表单的预留格子的dom
    });
  };

  /**
   * 测绘单位状态限制
   * @param params
   * @returns {Promise<unknown>}
   * @example
   * sInfo_ShowMappingUnitStatusDetail({
   *   modalParams: {
   *     modalType: 'confirm',
   *     modalTitle: '测绘单位状态限制',
   *     confirmCallback: (a) => { console.log(a) },
   *     cancelCallback: (a) => { console.log(a) },
   *     width: '40%',
   *     okText: '关闭'
   *   },
   *   modalParams: {
   *     modalType: 'alert',
   *     modalTitle: '测绘单位状态限制',
   *     confirmCallback: (a) => { console.log(a) },
   *     cancelCallback: (a) => { console.log(a) },
   *     width: '40%',
   *     okText: '关闭'
   *   },
   *   vue: Sgui,
   *   controlId: '',
   *   modalDetail: {
          title: '测绘单位信息完善提示',
          statusText: '当前账号已移除备案名录库，请联系主管部门!待重新加入名录库，再进行业务受理！',
          linkText: '请前往【机构管理】进行修改，待审核通过后才能进行业务办理',
          highligntLinkText: '机构管理'// 需要高亮显示的文案--默认为需要跳转的系统别名
        }
   * })
   */
  this.sInfo_ShowMappingUnitStatusDetail = function (params) {
    const { baseModal } = window.top.IBaseExpressLib;
    const {
      vue,
      controlId,
      modalDetail,
      modalParams,
      clickFun = () => {},
    } = { ...(params || {}) };

    let promiseResolve = null;
    let vueInstance = null;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "modalDetailWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
                    <div :id="controlId" style="text-align: center;">
                      <div>
                        <sg-icon type="iconwarningfill" size="80" color="#faad14" />
                      </div>
                      <h1 style="font-size: 22px; font-weight: bold;">{{ modalDetail.title }}</h1>
                      <p>{{ modalDetail.statusText }}</p>
                      <p v-if="modalDetail.linkText">
                        <span v-if="modalDetail.highligntLinkText">
                          {{ modalDetail.linkText.split(modalDetail.highligntLinkText)[0] }}
                          <a style="color: #2377dc;" @click="handleGoTo(modalDetail)">{{ modalDetail.highligntLinkText }}</a>
                          {{ modalDetail.linkText.split(modalDetail.highligntLinkText)[1] }}
                        </span>
                        <span v-else>{{ modalDetail.linkText }}</span>
                      </p>
                    </div>
                    `,
          data() {
            return {
              controlId: controlId,
              modalDetail: modalDetail,
              modalParams,
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
          },
          methods: {
            handleGoTo(obj) {
              clickFun(obj);
            },
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      baseModal({
        vue: vue,
        ...modalParams,
        vueComponent: vueComponent,
        getVueInstance: () => vueInstance,
      });
    });
  };
  // 弹窗图片
  this.sInfo_ImageModal = function (params) {
    const { baseModal } = window.top.IBaseExpressLib;
    const { vue, controlId, modalDetail, modalParams } = { ...(params || {}) };

    let promiseResolve = null;
    let vueInstance = null;
    let documentBody = window.document;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "ImageModalWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
                    <div :id="controlId" style="text-align: left; width: 100%;" :style="modalDetail.cssStyle" ref="imageWrap">
                      <img :src="modalDetail.imgUrl" style="width: 100%;" :style="modalDetail.imgCssStyle"></img>
                    </div>
                    `,
          data() {
            return {
              controlId: controlId,
              modalDetail: modalDetail,
              modalParams,
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
            setTimeout(() => {
              vueInstance.$parent.$el
                  .querySelector(".sg-modal-body")
                  .scrollTo(0, 120);
            }, 50);
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      baseModal({
        vue: vue,
        ...modalParams,
        vueComponent: vueComponent,
        getVueInstance: () => vueInstance,
      });
    });
  };
  // 弹窗iframe
  /**
   *
   * @param {*} params
   {
      vue: Sgui,
      controlId: '123',
      iframeId: rid,
      modalDetail: {
          iframeUrl: `/mainProject/lotto.html?rid=${rid}&count=${count}&type=${type}`,
          cssStyle: {
              height: '95%'
          }
      },
      btnList: [
        { label: '按钮1', icon: 'iconzhongzhi', size: 'small',
          type: '', // text --- 链接按钮 primary --- 主按钮 info --- 提示按钮 success --- 成功按钮 warning --- 警告按钮 error ---错误按钮
          isAntiShake: true, // 防抖
          clickCallback: () => { setTimeout(() => return true, 1000) }
        },
        { label: '按钮2', icon: 'iconfujian1-', size: 'small', clickCallback: () => {Sgui.$modal.remove()} },
      ],
      modalParams: {
        modalTitle: '抽签',
        width: "550px",
        height: "550px",
        okText: ' 确认 ',
        // okClass: "okClass",
        confirmCallback: () => {
            _drawLotsCallback();
        },
        cancelCallback: () => {
            _drawLotsCallback();
        },
      }
    }
   */
  this.sInfo_IframeModal = function (params) {
    const { baseModal } = window.top.IBaseExpressLib;
    const { vue, controlId, modalDetail, modalParams, btnList, iframeId } = { ...(params || {}) };

    let promiseResolve = null;
    let vueInstance = null;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "ImageModalWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
                    <div :id="controlId" style="text-align: left; width: 100%; padding: 20px;" :style="modalDetail.cssStyle">
                      <iframe :id="iframeId" :src="modalDetail.iframeUrl" style="width: 100%; min-height: 100%; border: 0;"></iframe>
                      <div v-if="btnList.length" style="height: 40px; line-height: 40px; text-align: right;">
                        <sg-button v-for="(btn, index) in btnList" :key="index" :type="btn.type" :size="btn.size" :icon="btn.icon" :loading="btn.loading"  @click="handleClick(btn, index)" style="margin-left: 12px; padding: 10px;" :style="{border: !btn.type || btn.type ==='text' ? '1px solid #dfdfdf' : 0}">{{ btn.label }}</sg-button>
                      </div>
                    </div>
                    `,
          data() {
            return {
              controlId: controlId,
              modalDetail: modalDetail,
              modalParams,
              iframeId,
              btnList
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
          },
          methods: {
            async handleClick(btn, index) {
              if (btn.clickCallback) {
                if (btn.isAntiShake) {
                  this.btnList[index].loading = true;
                  const result = await btn.clickCallback(btn, index);
                  console.log(result, 'result');
                  if (result) {
                    this.btnList[index].loading = false;
                  }
                } else {
                  btn.clickCallback(btn, index);
                }
              }
            },
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      baseModal({
        vue: vue,
        ...modalParams,
        vueComponent: vueComponent,
        getVueInstance: () => vueInstance,
      });
    });
  };
  // pdf动态表格
  this.sInfo_DynamicTable = function (params) {
    const { selector, domId, tableData } = { ...(params || {}) };
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "dynamicTable",
      style: `
        .dynamicTable {
          width: 1200px;
          margin: 0 auto;
        }

        .dynamicTable table {
          width:100%;
        }

        .dynamicTable .tableWrap {
          text-align: center;
        }

        .dynamicTable .tableWrap .tableHeader {
          display: flex;
        }

        .dynamicTable .tableWrap .tableHeader.left {
          border-right: 1px solid #333;
        }

        .dynamicTable .tableWrap .tableHeader .tableHeaderTd {
          padding: 8px 10px;
        }

        .dynamicTable .flex {
          flex: 1;
        }

        .dynamicTable .borderRight {
          border-right: 1px solid #333;
        }

        .dynamicTable .borderLeft {
          border-left: 1px solid #333;
        }

        .dynamicTable .tableContent .tableTr {
          display: flex;
          min-height: 42px;
        }

        .dynamicTable .tableContent .tableTd > div,
        .dynamicTable .padding4 {
          padding: 4px 0;
        }

        .dynamicTable .flexContent {
          display:flex;
          justify-content: center;
          align-items: center;
        }

        .dynamicTable .text-overflow {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          word-break: break-all;
        }
      `,
    });
    let vueComponent = {
      template: `
        <div :id="domId" class="dynamicTable">
          <sg-descriptions title="" :column="1" border labelTextAlign="center" contentTextAlign="center" :labelStyle="{width: '190px', border: '1px solid #333', padding: '5px 10px', color: '#333', background: 'transparent', textAlign: 'center'}">
            <sg-descriptions-item :label="tableData && tableData['基本数据'][0].text"  :contentStyle="contentStyle">{{ tableData && tableData['基本数据'][0].value }}</sg-descriptions-item>
          </sg-descriptions>
          <sg-row class="tableWrap">
            <sg-col class="tableHeader left" :span="12">
              <div class="tableHeaderTd borderRight borderLeft" style="width: 191px;">建筑用途</div>
              <div class="tableHeaderTd flex">建筑面积（㎡）</div>
            </sg-col>
            <sg-col class="tableHeader right" :span="12">
              <div class="tableHeaderTd borderRight" style="width: 191px;">计容系数</div>
              <div class="tableHeaderTd flex borderRight">计容建筑面积（㎡）</div>
              <div class="tableHeaderTd borderRight" style="width: 191px;">备注</div>
            </sg-col>
          </sg-row>
          <sg-descriptions v-if="tableData && tableData['建筑用途']" title="" :column="1" class="tableContent" border labelTextAlign="center" contentTextAlign="center" :labelStyle="{width:'60px', border: '1px solid #333', padding: '0 10px', color: '#333', background: 'transparent', textAlign: 'center'}" :contentStyle="{ border: '1px solid #333', padding: 0, textAlign: 'center' }">
            <sg-descriptions-item v-for="item in tableData['建筑用途']" :key="item.key" :label="item.key">
              <div class="tableTr">
                <div class="tableTd borderRight" style="width: 130px;">
                  <div class="text-overflow" :style="{borderBottom: index === item.value.length - 1 ? '0' : '1px solid #333'}" v-for="(value, index) in item.value" :key="index" :title="value.jzyt">{{ value.jzyt }}</div>
                </div>
                <div class="tableTd borderRight" style="width: 124px; border-right: 1px solid #333;">
                  <div class="text-overflow" :style="{borderBottom: index === item.value.length - 1 ? '0' : '1px solid #333'}" v-for="(value, index) in item.value" :key="index" :title="value.jzmj">{{ value.jzmj }}</div>
                </div>
                <div class="tableTd borderRight text-overflow padding4 flexContent" style="width: 285px;" :title="item.jzmjhj">{{ item.jzmjhj }}</div>
                <div class="tableTd borderRight text-overflow" style="width: 191px;border-right: 1px solid #333;">
                  <div class="text-overflow" :style="{borderBottom: index === item.value.length - 1 ? '0' : '1px solid #333'}" v-for="(value, index) in item.value" :key="index" :title="value.jrxs">{{ value.jrxs }}</div>
                </div>
                <div class="tableTd borderRight" style="width: 110px;border-right: 1px solid #333;">
                  <div class="text-overflow" :style="{borderBottom: index === item.value.length - 1 ? '0' : '1px solid #333'}" v-for="(value, index) in item.value" :key="index" :title="value.jrjzmj">{{ value.jrjzmj }}</div>
                </div>
                <div class="tableTd borderRight padding4 flexContent" style="flex: 1;" :title="item.jrmjhj">{{ item.jrmjhj }}</div>
                <div class="tableTd padding4 flexContent" style="width: 190px;"></div>
              </div>
            </sg-descriptions-item>
          </sg-descriptions>
          <sg-descriptions v-if="tableData && tableData['基本数据']" title="" :column="2" border labelTextAlign="center" contentTextAlign="center" :labelStyle="{width: '194px', border: '1px solid #333', padding: '5px 10px', color: '#333', background: 'transparent', textAlign: 'center'}" :contentStyle="{ border: '1px solid #333', padding: '5px 10px', width: '420px', textAlign: 'center'}" style="margin-top: -1px;">
            <sg-descriptions-item  v-for="item in tableData['基本数据'].filter((i, index) => index)" :key="item.key" :label="item.text">{{ item.value }}</sg-descriptions-item>
            <!-- <sg-descriptions-item label="-">-</sg-descriptions-item> -->
            <!-- <sg-descriptions-item  v-for="item in tableData['基本数据'].filter((i, index) => index > 7 && index < 10)" :key="item.key" :label="item.text">{{ item.value }}</sg-descriptions-item> -->
          </sg-descriptions>
          <sg-descriptions title="" :column="2" border labelTextAlign="center" contentTextAlign="center" :labelStyle="{width: '60px', border: '1px solid #333', padding: 0, color: '#333', background: 'transparent', textAlign: 'center'}" :contentStyle="{ border: '1px solid #333', padding: 0, textAlign: 'center'}" style="margin-top: -1px;">
            <sg-descriptions-item  label="地上">
              <div>
                <div v-for="item in tableData['地上机动车位']" :key="item.cwlx" style="display:flex">
                  <div class="borderRight padding4" style="width:130px;">{{ item.cwlx }}</div>
                  <div style="width:405px;">{{ item.sl }}</div>
                </div>
              </div>
            </sg-descriptions-item>
            <sg-descriptions-item  label="地上">
              <div>
                <div v-for="item in tableData['地上非车位']" :key="item.cwlx" style="display:flex">
                  <div class="borderRight padding4" style="width:130px;">{{ item.cwlx }}</div>
                  <div style="width:405px;">{{ item.sl }}</div>
                </div>
              </div>
            </sg-descriptions-item>
          </sg-descriptions>
          <sg-descriptions v-if="tableData" title="" :column="2" border labelTextAlign="center" contentTextAlign="center" :labelStyle="{width: '60px', border: '1px solid #333', padding: 0, color: '#333', background: 'transparent', textAlign: 'center'}" :contentStyle="{ border: '1px solid #333', padding: 0, textAlign: 'center'}" style="margin-top: -1px;">
            <sg-descriptions-item label="地下">
              <div>
                <div style="display:flex; border-bottom: 1px solid #333;">
                  <div class="borderRight padding4" style="width:130px;">车位类型</div>
                  <div class="borderRight padding4" style="width:137px;">数量</div>
                  <div class="borderRight padding4" style="width:137px;">折算系数</div>
                  <div class="padding4" style="width:134px;">折算数量</div>
                </div>
                <div v-for="(item, index) in tableData['地下机动车位']" :key="item.cwlx" style="display:flex">
                  <div class="borderRight padding4" style="width:130px;" :style="{borderBottom: index === tableData['地下机动车位'].length - 1 ? '0' : '1px solid #333'}">{{ item.cwlx }}</div>
                  <div class="borderRight padding4" style="width:137px;" :style="{borderBottom: index === tableData['地下机动车位'].length - 1 ? '0' : '1px solid #333'}">{{ item.sl }}</div>
                  <div class="borderRight padding4" style="width:137px;" :style="{borderBottom: index === tableData['地下机动车位'].length - 1 ? '0' : '1px solid #333'}">{{ item.zsxs }}</div>
                  <div class="padding4" style="width:134px;" :style="{borderBottom: index === tableData['地下机动车位'].length - 1 ? '0' : '1px solid #333'}">{{ item.zssl }}</div>
                </div>
              </div>
            </sg-descriptions-item>
            <sg-descriptions-item  label="地下">
              <div>
                <div v-for="item in tableData['地下非车位']" :key="item.cwlx" style="display:flex; border-bottom: 1px solid #333;">
                  <div class="borderRight padding4" style="width:130px;">{{ item.cwlx }}</div>
                  <div style="width:408px;">{{ item.sl }}</div>
                </div>
                <div v-for="item in (tableData['地下机动车位'].length - tableData['地下非车位'].length + 1)" :key="item" style="display:flex">
                  <div class="borderRight padding4" style="width:130px;" :style="{borderBottom: item === tableData['地下机动车位'].length - tableData['地下非车位'].length + 1 ? '0' : '1px solid #333'}">-</div>
                  <div style="width:408px;" :style="{borderBottom: item === tableData['地下机动车位'].length - tableData['地下非车位'].length + 1 ? '0' : '1px solid #333'}">-</div>
                </div>
              </div>
            </sg-descriptions-item>
          </sg-descriptions>
        </div>
    `,
      data() {
        return {
          contentStyle: {
            "text-align": "left",
            border: "1px solid #333",
            padding: "5px 10px",
          },
          domId: domId,
          tableData: tableData,
        };
      },
      methods: {
        showContractModal() {
          buttonCallback(params);
        },
      },
    };
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: vueComponent,
      selector: selector, // 平台表单的预留格子的dom
    });
  };
  // 弹窗树
  this.sInfo_TreeModal = function (params) {
    const { baseModal, fileTree } = window.top.IBaseExpressLib;
    const { vue, controlId, modalDetail, modalParams } = { ...(params || {}) };

    let promiseResolve = null;
    let vueInstance = null;
    let documentBody = window.document;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "ImageModalWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
                    <div :id="controlId" style="text-align: left; width: 100%;" :style="modalDetail.cssStyle" ref="treeWrap">
                        <div id="fileTree"></div>
                    </div>
                    `,
          data() {
            return {
              controlId: controlId,
              modalDetail: modalDetail,
              modalParams,
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
            fileTree({
              // modalParams: {
              //   modalType: 'confirm',
              //   modalTitle: '11jhjhjhj',
              //   confirmCallback: (a) => { console.log(a) },
              //   cancelCallback: (a) => { console.log(a) },
              //   width: '50vw',
              // },
              vue: Sgui,
              selector: document.getElementById("fileTree"), // dom目标
              fileTreeParams: {
                filter: true, // 是否可以筛选节点，为true头部会出现筛选输入框
                style: {
                  width: "100%",
                  margin: 0,
                  height: "300px",
                  border: "1px solid #ccc",
                }, // 动态树样式
                fileDownloadBtn: false,
                emptyText: "暂无数据",
                onNodeClick: (node) => {
                  console.log(node);
                  tree2.getResTreeData(node, "附加参数");
                },
                // 获取文件树接口数据
                customTreeDataFun: () => {
                  return new Promise((resolve, reject) => {
                    try {
                      resolve([
                        {
                          fileName: "办件材料",
                          listFile: [
                            {
                              fileName: "规划蓝线图",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "营业执照",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "主要技术经济指标复核资料",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "规划验线其他材料",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "地籍测量资料",
                              filePath: "",
                              fileType: "0",
                            },
                          ],
                          filePath: "",
                          fileType: "0",
                        },
                        {
                          rid: "1212",
                          fileName: "数据申请材料",
                          filePath: "",
                          fileType: "0",
                        },
                        {
                          fileName: "成果包",
                          listFile: [
                            {
                              fileName: "选址测绘",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "土地勘测定界测量",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "地籍调查",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "拨地测量",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "报建现状地形图测绘",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "主要技术经济指标复核",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "规划放线测量",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "房产预测绘",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "规划验线测量",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "规划条件核实和土地核验测量",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "地籍测量",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "房产实测绘",
                              filePath: "",
                              fileType: "0",
                            },
                            {
                              fileName: "人防测量",
                              filePath: "",
                              fileType: "0",
                            },
                          ],
                          filePath: "",
                          fileType: "0",
                        },
                      ]);
                    } catch (error) {
                      reject(error);
                    }
                  });
                },
              },
            }).then((tree1) => {
              console.log(tree1);
              window.tree1 = tree1;
            });
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      baseModal({
        vue: vue,
        ...modalParams,
        vueComponent: vueComponent,
        getVueInstance: () => vueInstance,
      });
    });
  };

  /**
   * 北京测绘院项目详情顶部展示模块（含标题）
   * @param selector
   * @param btnList
   * [
   *  { label: '更新项目', icon: 'iconzhongzhi', size: 'small',
   *    type: '' text --- 链接按钮 primary --- 主按钮 info --- 提示按钮 success --- 成功按钮 warning --- 警告按钮 error ---错误按钮
   *    clickCallback: () => {}
   *  },
   *  { label: '上传附件', icon: 'iconfujian1-', size: 'small', clickCallback: () => {} },
   *  { label: '新建项目', icon: 'iconadd', size: 'small', type: 'select', selectOptions: [{label: '部门任务', value: 1, clickCallback: () => {}}] }
   * ]
   * @param infoList
   * [
   *  {  label: '当前状态', type: 'status', value: '正常' },
   *  { label: '负责人员', type: '', value: '赵小刚' },
   *  { label: '可见范围', type: '', value: '参与人员可见' },
   *  { label: '开始时间', type: '', value: '2020-11-30' },
   *  { label: '结束时间', type: '', value: '赵小刚' },
   *  { label: '最后更新', type: '', value: '2020-12-06' },
   *  { label: '项目进度', type: 'progress', value: 50 },
   * ]
   * @param logoSrc logo图片地址
   * @param backgroundSrc 模块背景图地址
   * @param title 项目名称
   * @param address 项目地址
   * @param domId 唯一标识id
   */
  this.sInfo_projectDetailHeader = function (params) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_projectDetailHeader",
      style: `
        .projectDetailHeader .sg-select-selection .sg-select-placeholder {
          color: #1891FF;
        }

        .projectDetailHeader .sg-btn-small {
          height: 32px;
        }

        .projectDetailHeader .sg-btn-small {
          height: 32px;
        }

        .projectDetailHeader .sg-select.sg-select-single {
          min-height: unset !important;
          position: relative;
          top: -1.5px;
        }
      `,
    });
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
            <div :id="domId" class="projectDetailHeader" style="display: flex; padding: 16px;color: #333;background: linear-gradient( 180deg, rgba(24,145,255,0.2) 0%, rgba(216,216,216,0) 100%);" :style="{ backgroundSize: '100% 100'}">
              <div style="margin-left: 20px; margin-right: 18px; width: 66px;">
                <img :src="logoSrc" style="width: 100%; height: auto;"></img>
              </div>
              <div style="flex: 1;">
                <div style="display: flex;">
                  <div style="flex: 1;">
                    <h2>{{ title }}</h2>
                    <h4>{{ address }}</h4>
                  </div>
                  <div style="width: 60%; text-align: right;">
                    <span v-for="(btn, index) in btnList" :key="index">
                      <sg-dropdown v-if="btn.type === 'select'" transfer @on-click="(e) => handleSelect(e, btn)" style="margin-left: 12px; color: #1891FF;background: #fff; padding: 4px 8px; border-radius: 4px; border: 1px solid #d9d9d9;">
                        <a style="font-weight: normal">
                          {{ btn.label }}
                          <sg-icon type="iconxiala" size="12"></sg-icon>
                        </a>
                        <div slot="menu">
                          <sg-dropdown-item
                            v-for="(select, i) in btn.selectOptions"
                            :key="i"
                            :selected="name == select.value"
                            :name="select.value"
                            >{{select.label}}</sg-dropdown-item
                          >
                        </div>
                      </sg-dropdown>
                      <sg-button v-else  :type="btn.type" :size="btn.size" :icon="btn.icon"  @click="handleClick(btn)" style="margin-left: 12px; color: #1891FF; padding: 10px;">{{ btn.label }}</sg-button>
                    </span>
                  </div>
                </div>
                <sg-row class="infoList" style="margin-top: 30px; font-size: 12px;">
                  <sg-col v-for="(info, index) in infoList" :key="index" :column="2" style="flex: 0 0 14%;">
                    <div style="color: #999; margin-bottom: 10px;">{{ info.label }}</div>
                    <div>
                      <sg-progress v-if="info.type === 'progress'" :percent="info.value" status="#1891FF" />
                      <span v-else>{{ info.value }}</span>
                    </div>
                  </sg-col>
                </sg-row>
              </div>
            </div>
          `,
        data() {
          return {
            domId: params.domId,
            logoSrc: params.logoSrc || '',
            backgroundSrc: params.backgroundSrc || '',
            title: params.title || '',
            address: params.address || '',
            btnList: params.btnList || [],
            infoList: params.infoList || [],
          };
        },
        methods: {
          handleClick(btn) {
            btn.clickCallback()
          },
          handleSelect(e, btn) {
            const currentSelect = btn.selectOptions.find(i => i.value === e)
            currentSelect.clickCallback()
          }
        }
      },
      selector: document.getElementById(params.domId), // 平台表单的预留格子的dom
    });
  };

  /**
   * 北京测绘院项目详情任务列表标签页
   * @param selector
   * @param taskTypeList // 任务类型筛选列表
   * [
   *  { label: '全部', value: '' },
   *  { label: '部门任务', value: 'depart' },
   *  { label: '测量组任务', value: 'measure' }
   * ]
   * @param taskList  // 任务列表
   * status： going-进行中 finish-已完成 warning-预警中
   * priority：emergent-紧急 important-重要 normal-普通 lower-较低
   * [
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'going', deadline: '2023年12月01日', depart: '测绘和调查一部', priority: 'emergent' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'finish', deadline: '2023年12月01日', depart: '航测遥感部', priority: 'important' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'warning', deadline: '2023年12月01日', depart: '基础测绘部', priority: 'normal' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'going', deadline: '2023年12月01日', depart: '测绘和调查一部', priority: 'lower' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'going', deadline: '2023年12月01日', depart: '测绘和调查一部', priority: 'emergent' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'finish', deadline: '2023年12月01日', depart: '航测遥感部', priority: 'important' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'warning', deadline: '2023年12月01日', depart: '基础测绘部', priority: 'normal' },
   *  { title: '2023年度地理国情监测项目-测绘和调查一部任务', status: 'going', deadline: '2023年12月01日', depart: '测绘和调查一部', priority: 'lower' },
   * ]
   * @param domId 唯一标识id
   * @param taskType 当前选中任务类型
   * @param taskTypeChangeCallback 切换任务类型回调函数
   */
  this.sInfo_projectDetailTask = function (params) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_projectDetailTask",
      style: `
      .projectDetailTask .taskList .sg-col-3 {
        flex: 0 0 calc((100% - 48px) / 4);
        max-width: 25%;
        margin-right: 16px;
        padding: 16px !important;
        border-radius: 4px 4px 4px 4px;
        border: 1px solid #E5E5E5;
        margin-top: 16px;
      }
      .projectDetailTask .taskList .sg-col-3.col3 {
        margin-right: 0;
      }

      .projectDetailTask .taskList .sg-col-3 .emergent {
        color: #FF2E3A;
        background: rgba(255, 46, 58, 0.1)
      }

      .projectDetailTask .taskList .sg-col-3 .important {
        color: #00B87D;
        background: rgba(0, 184, 125, 0.1)
      }

      .projectDetailTask .taskList .sg-col-3 .normal {
        color: #1891FF;
        background: rgba(24, 145, 255, 0.1)
      }

      .projectDetailTask .taskList .sg-col-3 .lower {
        color: #FF9700;
        background: rgba(255, 151, 0, 0.1)
      }

      .projectDetailTask .sg-radio-button-label {
        border: 0;
      }

      .projectDetailTask  .sg-radio-button {
        text-indent: 0;
      }

      .projectDetailTask .sg-radio-button-checked .sg-radio-button-label {
        border-radius: 4px;
        box-shadow: none;
        background: rgba(24, 145, 255, 0.1);
        color: rgba(24, 145, 255, 1);
      }
    `,
    });
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
            <div :id="domId" style="color: #333;" class="projectDetailTask">
<!--              <sg-radio-group v-model="taskType" @on-change="handleTaskTypeChange">-->
<!--                <sg-radio-button v-for="item in taskTypeList" :key="item.value" :label="item.value">{{ item.label }}</sg-radio-button>-->
<!--              </sg-radio-group>-->
              <div>
                <sg-row class="taskList">
                  <sg-col v-for="(task, index) in taskList" :key="index" :column="3" style="position: relative;" :class="['col' + index % 4]" @dblclick.native="handleGoTo(task)">
                    <div style="position: absolute; left: 0; top: 16px; width: 4px; height: 23px;" :style="{ background: task.status === 'warning' ? '#FF9700' : task.status === 'finish' ? '#00B87D' : '#1891FF' }"></div>
                    <h3 style="margin-bottom: 16px;">{{ task.title }}</h3>
                    <div>
                      <div style="margin-top: 5px;">
                        <span style="color: #999">项目状态：</span>
                        <span>{{ task.status === 'warning' ? '预警中' : task.status === 'finish' ? '已完成' : '进行中'}}</span>
                      </div>
                      <div style="margin-top: 5px;">
                        <span style="color: #999">创建时间：</span>
                        <span>{{ task.deadline }}</span>
                      </div>
                      <div style="margin-top: 5px;">
                        <span style="color: #999">{{task.departLabel}}：</span>
                        <span :style="{ color: task.status === 'warning' ? '#FF9700' : task.status === 'finish' ? '#00B87D' : '#1891FF' }">{{ task.depart }}</span>
                      </div>
                    </div>
                    <div style="position: absolute; right: 0; bottom: 0; padding: 3px 3px 1px 10px; border-radius: 15px 0 0 0;" :class="task.priority">
                      <span>{{ task.status === 'finish' ? '已完成' : '进行中'}}</span>
                    </div>
                  </sg-col>
                </sg-row>
              </div>
            </div>
          `,
        data() {
          return {
            domId: params.domId,
            taskTypeList: params.taskTypeList || [],
            taskList: params.taskList || [],
            taskType: params.taskType || ''
          };
        },
        methods: {
          handleTaskTypeChange() {
            params.taskTypeChangeCallback(this.taskType)
          },
          handleGoTo(item) {
            window.$.F.openForm({
              title: '正在打开中...',
              jid: item.JID,
              processInstanceId: item.PROCESSINSTANCEID,
              taskId: item.TASKID
            })
          }
        }
      },
      selector: document.getElementById(params.domId), // 平台表单的预留格子的dom
    });
  };

  /**
   * 北京测绘院项目详情项目流程标签页
   * @param selector
   * @param timelineList  // 时间线列表
   * status： normal-普通 abnormal-异常
   * timelineList: [
   {
      timestamp: '04-12',
      type: 'primary',
      user: '赵小刚',
      role: '项目经理',
      progressDesc: '新建生产任务RW20230828009、RW20230828010',
      detailTime: '2018-04-12 20:46',
      status: 'normal',
      progress: 70
    },
   {
      timestamp: '04-03',
      user: '赵小刚',
      role: '项目经理',
      progressDesc: '提交任务RW202308280050',
      detailTime: '2018-04-03 20:46',
      status: 'abnormal',
      progress: 70
    }
   ]
   * @param domId 唯一标识id
   */
  this.sInfo_projectDetailTimeLine = function (params) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_projectDetailTimeLine",
      style: `
      .projectDetailTimeLine .sg-timeline-item__node {
        background-color: #1891FF;
      }
  
      .projectDetailTimeLine .sg-timeline-item__timestamp {
        color: #3d3d3d;
        font-size: 16px;
      }

      .projectDetailTimeLine .sg-circle__text {
        color: #3d3d3d;
        font-size: 16px !importan;
        font-weight: bold;
      }
    `,
    });

    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
          <div :id="domId" style="padding: 16px;color: #3D3D3D;height: 500px" class="projectDetailTimeLine">
            <sg-timeline>
              <sg-timeline-item v-for="(timeline, index) in timelineList" :key="index" :timestamp="timeline.timestamp" placement="top">
                <div style="display: flex;border-radius: 4px 4px 4px 4px;border: 1px solid #E5E5E5;padding: 10px;">
                  <div style="flex: 1;">
                    <div style="margin-bottom: 10px;display: flex; align-items: center;">
                      <sg-icon type="iconguanliyuan1" color="#1891FF" :size="20"/>
                      <span style="font-size: 16px; font-weight: bold; padding: 0 10px">{{ timeline.user }}</span>
                      <span style="color: #999;">{{ timeline.role }}</span>
                    </div>
                    <div>
                      {{ timeline.progressDesc }}
                      <span style="padding: 3px 8px;" :style="{ color: timeline.status === 'abnormal' ? '#FF2E3A' : '#00B87D', background: timeline.status === 'abnormal' ? 'rgba(255,46,58,0.1)' : 'rgba(0,184,125,0.1)' }">{{ timeline.status === 'normal' ? '正常' : '异常' }}</span>
                    </div>
                    <div>{{ timeline.detailTime }}</div>
                  </div>
<!--                  <div style="display: flex;align-items: center; margin-right: 20px;">-->
<!--                    <sg-circle :percentage="timeline.progress" text-color="#3BA1FF" :width="74" text-color="#3d3d3d"></sg-circle>-->
<!--                  <div>-->
                </div>
              </sg-timeline-item>
            </sg-timeline>
          </div>
        `,
        data() {
          return {
            domId: params.domId,
            timelineList: params.timelineList || []
          };
        },
        methods: {}
      },
      selector: document.getElementById(params.domId), // 平台表单的预留格子的dom
    });
  };

  /**
   * 北京测绘院任务详情顶部展示模块
   * @param selector
   * @param title 标题
   * @param backgroundSrc 模块背景图地址
   * @param btnList: [
   { label: '编辑项目', type: 'primary', icon: 'iconshuru', size: 'small', clickCallback: () => {} },
   { label: '删除项目', type: 'primary', icon: 'icondelete', size: 'small', clickCallback: () => {} }
   ]
   * @param domId 唯一标识id
   * @param currentStep 当前环节
   * @param deadline 办理期限
   * @param leaveTime 剩余
   * @param infoList 信息列表
   * @param isSticky 是否固定在顶部
   */
  this.sInfo_taskDetailHeader = function (params) {
    // 检查 DOM 元素是否存在
    const targetElement = document.getElementById(params.domId);
    if (!targetElement) {
      console.error('Target element not found with ID:', params.domId);
      return;
    }

    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_taskDetailHeader",
      style: `
        .taskDetailHeader{}

        .taskDetailHeader.isSticky {
          position: fixed;
          width: calc(100% - 54px);
          top: 32px;
          z-index: 9;
        }
      `,
    });
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
            <div :id="domId" class="taskDetailHeader" style="display: flex; padding: 20px 16px;color: #333;align-items: center;" :style="dynamicStyle" :class="{ isSticky }">
              <div style="margin-right: 18px; font-size: 18px; color: #3D3D3D; line-height: 22px; font-weight: bold;">
                <h3>{{ title }}</h3>
                <div style="margin-top: 12px;">
                  <span style="padding-right: 16px;" :style="{ borderRight: infoList.length ? '1px solid #ACB8C2': 0 }">
                    <span class="dot" style="display: inline-block; width: 8px; height: 8px; border-radius: 4px; background: #1891FF;margin-right: 8px;    position: relative;top: -2px;"></span>
                    <label style="font-weight: normal;font-size: 16px;">当前环节：</label>
                    <span style="color: #1891FF">{{ currentStep }} </span>
                  </span>
<!--                  <span style="padding: 0 16px;">-->
<!--                    <label style="font-weight: normal;font-size: 16px;">办理期限：</label>-->
<!--                    <span style="color: #3D3D3D; font-weight: bold;">{{ deadline }} </span>-->
<!--                  </span>-->
                  <span v-if="leaveTime">
                    <label style="font-weight: normal;font-size: 16px; padding-left: 10px;">剩余：</label>
                    <span style="color: #FF2E3A">{{ leaveTime }} </span>
                  </span>
                </div>
              </div>
              <div style="flex: 1;text-align: right;">
                <sg-button v-for="(btn, index) in btnList" :type="btn.type" :size="btn.size" :icon="btn.icon"  @click="handleClick(btn)" style="margin-left: 12px; padding: 8px 16px;">{{ btn.label }}</sg-button>
              </div>
            </div>
          `,
        data() {
          return {
            domId: params.domId,
            title: params.title || '',
            dynamicStyle: {
              background: `url(${params.backgroundSrc})`,
              backgroundSize: '100%',
              backgroundColor: '#fff'
            },
            btnList: params.btnList || [],
            currentStep: params.currentStep || '',
            // deadline: params.deadline || '',
            leaveTime: params.leaveTime || '',
            infoList: params.infoList || [],
            isSticky: params.isSticky || false // 是否固定在顶部
          };
        },
        methods: {
          handleClick(btn) {
            btn.clickCallback()
          }
        }
      },
      selector: targetElement, // 使用已验证的 DOM 元素
    });
  };

  /**
   * 左侧选择树，右侧展示选择列表弹窗
   * @param modalParams {
      modalType: 'confirm',
      modalTitle: '我是选择树列表弹窗',
      confirmCallback: (a) => { console.log(a) },
      cancelCallback: (a) => { console.log(a) },
      width: '40%'
    }
   * @param controlId 唯一标识id
   * @param treeData 选择树数据
   */
  this.sInfo_SelectTreeListModal = function (params) {
    const { baseModal } = window.top.IBaseExpressLib;
    const {
      vue,
      controlId,
      modalParams,
      treeData,
      selectedMulti,
    } = { ...(params || {}) };

    let promiseResolve = null;
    let vueInstance = null;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "modalDetailWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
            <div :id="controlId" style="text-align: center; display:flex; width: 100%;">
              <div style="width: 49%;margin-bottom: 60px;border: 1px solid #efefef;padding: 5px 10px;height: 400px; overflow: auto;">
                <sg-tree :data="treeData" default-expand-all filter @on-node-click="handleNodeClick"></sg-tree>
              </div>
              <div style="margin-left: 2%;border: 1px solid #efefef;width: 49%;margin-bottom: 60px;text-align: left;}">
                <h4 style="background: #ddd;padding: 10px 15px;">可选</h4>
                <div class="rangeDataList">
                  <div v-if="selectedMulti">
                    <sg-checkbox-group v-model="checkAllGroup" @on-change="handleRangeClick">
                      <sg-checkbox v-for="range in rangeDataList" :key="range.id" :label="range.id" style="display: block; padding: 5px 10px;">{{ range.label }}</sg-checkbox>
                    </sg-checkbox-group>
                  </div>
                  <div v-else>
                    <p 
                      v-for="range in rangeDataList"
                      :key="range.id"
                      style="padding: 10px;padding-bottom: 0;"
                      @click="handleRangeClick(range)"
                      :style="{ color: selected.id === range.id ? '#1891ff' : '#333'}"
                    >{{ range.label }}</p>
                  </div
                </div>
              </div>
            </div>
          `,
          data() {
            return {
              controlId: controlId,
              modalParams,
              rangeDataList: [],
              treeData,
              selected: '',
              selectedMulti,
              checkAllGroup: [],
              checkedAllList: [] // 历史勾选的所有项id，用于多选时跨节点选择数据存储
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
          },
          methods: {
            handleNodeClick(data, item) {
              console.log("选中", data, item);
              this.rangeDataList = item.rangeDataList;
              this.selected = '';
              // 先清空右侧勾选checkbox
              this.checkAllGroup = [];
              const checkAllGroup = []
              // 再判断当前所选节点的rangeDataList是否有历史勾选的项，有的话则将其勾选
              this.checkedAllList.forEach((item) => {
                const currentRangeDataList = this.rangeDataList.map(i => i.id)
                if (currentRangeDataList.includes(item.id)) {
                  checkAllGroup.push(item.id)
                }
              });
              this.checkAllGroup = checkAllGroup
              this.selected = this.checkedAllList;
            },
            handleRangeClick(item) {
              if (this.selectedMulti) {
                // 将本次勾选的checkAllGroup项id加入checkedAllList，如果本次rangeDataList中有未勾选的项，并且在checkedAllList存在，则将其从checkedAllList中移除
                const checkedAllKeyList = this.checkedAllList.map(item => item.id)
                this.rangeDataList.forEach((range) => {
                  if (this.checkAllGroup.includes(range.id) && !checkedAllKeyList.map(item => item.id).includes(range.id)) {
                    this.checkedAllList.push(range);
                  } else if (!this.checkAllGroup.includes(range.id) && checkedAllKeyList.includes(range.id)) {
                    this.checkedAllList = this.checkedAllList.filter(item => item.id !== range.id)
                  }
                })
                this.checkedAllList = Array.from(new Set(this.checkedAllList))
                // 多选 找到勾选的项再rangeDataLis中的对象筛选出对应勾选对象数组
                this.selected = this.checkedAllList;
                console.log(this.selected);
              } else {
                this.selected = item;
              }
            },
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      baseModal({
        vue: vue,
        ...modalParams,
        vueComponent: vueComponent,
        getVueInstance: () => vueInstance,
      });
    });
  };

  /**
   * 详情顶部展示模块(带任务执行进度条)
   * @param selector
   * @param title 标题
   * @param backgroundSrc 模块背景图地址
   * @param btnList: [
   { label: '编辑项目', type: 'primary', icon: 'iconshuru', size: 'small', clickCallback: () => {} },
   { label: '删除项目', type: 'primary', icon: 'icondelete', size: 'small', clickCallback: () => {} }
   ]
   * @param domId 唯一标识id
   * @param currentStep 当前环节
   * @param infoList
   * [
   *  {  label: '剩余', type: '', value: '55天' },
   *  { label: '项目进度', type: 'progress', value: 50 },
   *  { label: '项目进度', type: 'progress', value: 70 },
   * ]
   */
  this.sInfo_taskDetailHeaderWithProgress = function (params) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_taskDetailHeaderWithProgress",
      style: `
        .taskDetailHeader{}
      `,
    });
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
            <div :id="domId" class="taskDetailHeader" style="display: flex; padding: 20px 16px;color: #333;align-items: center;" :style="dynamicStyle">
              <div style="margin-right: 18px; font-size: 18px; color: #3D3D3D; line-height: 22px; font-weight: bold; flex: 1;">
                <h3>{{ title }}</h3>
                <div style="margin-top: 12px; flex: 1;display: flex;">
                  <span style="padding-right: 16px;" :style="{ borderRight: infoList.length ? '1px solid #ACB8C2': 0 }">
                    <span class="dot" style="display: inline-block; width: 8px; height: 8px; border-radius: 4px; background: #1891FF;margin-right: 8px;    position: relative;top: -2px;"></span>
                    <label style="font-weight: normal;font-size: 16px;">当前环节：</label>
                    <span style="color: #1891FF">{{ currentStep }} </span>
                  </span>
                  <sg-row class="infoList" style="flex: 1; font-size: 12px;">
                    <sg-col v-for="(info, index) in infoList" :key="index" :column="2" style="padding-left: 10px; display: flex;">
                      <div style="color: #999; margin-right: 10px;">{{ info.label }}</div>
                      <div style="flex: 1;">
                        <sg-progress v-if="info.type === 'progress'" :percent="info.value" status="#1891FF" />
                        <span v-else>{{ info.value }}</span>
                      </div>
                    </sg-col>
                  </sg-row>
                </div>
              </div>
              <div style="max-width: 450px; text-align: right;">
                <sg-button v-for="(btn, index) in btnList" :type="btn.type" :size="btn.size" :icon="btn.icon"  @click="handleClick(btn)" style="margin-left: 12px; padding: 8px 16px;">{{ btn.label }}</sg-button>
              </div>
            </div>
          `,
        data() {
          return {
            domId: params.domId,
            title: params.title || '',
            dynamicStyle: {
              background: `url(${params.backgroundSrc})`,
              backgroundSize: '100%'
            },
            btnList: params.btnList || [],
            currentStep: params.currentStep || '',
            infoList : params.infoList || [],
          };
        },
        methods: {
          handleClick(btn) {
            btn.clickCallback()
          }
        }
      },
      selector: document.getElementById(params.domId), // 平台表单的预留格子的dom
    });
  };
  /**
   * 工作信息统计页面
   * @param params
   * ret: [{ name: '调查监测部', id: 1, childern: [
   *             { startTime: '2024-3-5 08:00:00', endTime: '2024-8-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 },
   *             { startTime: '2024-4-5 08:00:00', endTime: '2024-9-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 },
   *             { startTime: '2024-3-9 08:00:00', endTime: '2024-7-10 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 }]
   *           },
   *           { name: '航测遥感部', id: 2, childern: [
   *             { startTime: '2024-3-5 08:00:00', endTime: '2024-8-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 },
   *             { startTime: '2024-4-5 08:00:00', endTime: '2024-8-11 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 }]
   *           },
   *           { name: '基础测绘部', id: 3, childern: [
   *             { startTime: '2024-3-5 08:00:00', endTime: '2024-8-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 },
   *             { startTime: '2024-4-5 08:00:00', endTime: '2024-9-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 },
   *             { startTime: '2024-3-9 08:00:00', endTime: '2024-8-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 }] },
   *           { name: '测绘一部', id: 4, childern: [
   *             { startTime: '2024-3-5 08:00:00', endTime: '2024-8-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 }]
   *           },
   *           { name: '测绘二部', id: 5, childern: [
   *             { startTime: '2024-3-5 08:00:00', endTime: '2024-8-5 20:00:00', name: '2024年城市土地空间开发-海域区60%', percent: 60 }]
   *           }]
   */
  this.projectSchedule = function (params){
    const {
      controlId,
      res,
      newDataFunc
    } = { ...(params || {}) };
    let curVue = fdVersion.indexOf("3.5.") >= 0 ? $.F.getVueInstance() : Sgui;
    window.top.IBaseExpressLib.projectSchedule({
      vue: curVue,
      selector: document.getElementById(controlId), // dom目标，比如平台表单的预留格子的dom
      projectScheduleParams: {
        width: 900,// 宽度
        maxHeight: '800px',// 最大高度
        controlId: controlId,// 组件动态唯一标识
        document: window.document,
        dateChangeFun: (startTime, endTime) => { // 日期变化的回调函数
          console.log('日期变化', startTime, endTime)
          // 重新获取数据并返回
          const res = newDataFunc(startTime, endTime)
          return res
        },
        ganttDataFun: () => {
          return new Promise((resolve, reject) => {
            try {
              resolve(res)
            } catch (error) {
              reject(error)
            }
          })
        }
      },
    });
  };
  /**
   * 相关项目进度timeline纵向组件方法（目前用于张家港）
   * @param params
   * {
   *  domId: 'F6E2D17FE49E6A869E1E_3',
      dynamicStyle: {},
      projectList: [
        {
          rid: 'qw342343rwerwrwrw',
          name: '第一期',
          number: 1,
          status: '#808080',
          description: [{
            label: '项目名称',
            key: 'xmmc'
          },{
            label: '建设单位',
            key: 'jsdw'
          },{
            label: '2024-10-12 10:39:00',
            key: 'xmsj'
          }],
          clickCallback: (project) => {
            console.log('项目详情跳转', project);
          }
        }
      ]
   * }
   */
  this.sInfo_projectSteps = function (params) {
    window.top.IBaseExpressLib.addCssStyle({
      vue: Sgui,
      id: "sInfo_projectSteps",
      style: `
        .projectSteps{}
      `,
    });
    window.top.IBaseExpressLib.renderCustomVue({
      vue: Sgui,
      vueComponent: {
        template: `
            <div :id="domId" class="projectSteps" style="display: flex; padding: 20px 16px;color: #333;align-items: center;" :style="dynamicStyle">
              <div style="margin-right: 18px; font-size: 18px; color: #3D3D3D; line-height: 22px; flex: 1;">
                <sg-step :step-arr="stepArr" :active-step="currentStep" slot-name="slotName" slot-des="slotDes" completed-symbol="number">
                  <div slot="slotName" class="title" slot-scope="item" @click="handleClick(item)">
                    <div style="font-weight: bold;">{{ item.name }}</div>
                  </div>
                  <div slot="slotDes" slot-scope="item" class="desc" style="cursor: default;">
                    <div v-for="(item, index) in item.description" :key="index" style="color: #666;">{{ item.label }}</div>
                  </div>
                </sg-step>
              </div>
            </div>
          `,
        data() {
          return {
            domId: params.domId,
            dynamicStyle: params.dynamicStyle || {},
            currentStep: 0,
            stepArr: params.projectList || []
          };
        },
        mounted() {
          this.currentStep = this.stepArr.length
        },
        methods: {
          handleClick(btn) {
            btn.clickCallback(btn)
          }
        }
      },
      selector: document.getElementById(params.domId), // 平台表单的预留格子的dom
    });
  };

  // 选择坐标系弹窗
  /**
   * @param params
      {
      modalParams: {
        modalType: 'confirm',
        modalTitle: '选择坐标系弹窗',
        confirmCallback: (a) => { console.log(a) },
        cancelCallback: (a) => { console.log(a) },
        width: '40%',
        height: 600
      },
      vue: Sgui,
      controlId: '',
      coordinatesParams: {
        getCoordinatesListFun: async (params) => {
          return new Promise((resolve, reject) => {
            console.log(params, 'params');
            try {
              const res = [{
                id: 1,
                label: '坐标1',
                value: '123'
              }, {
                id: 2,
                label: '坐标2',
                value: '456'
              }]
              resolve(res);
              // const rid = $.F.getCurPageData("F53931795570FFE0BEE4")[0]["PROJ_CGHJB_CGQD.RID"];
              // const axios = window.top.axios || axios;
              // // TODO: 符合格式的接口，上面参数看情况改
              // axios({
              //   method: "get",
              //   url: "/sinfoweb/cghj/public/getCgbml",
              //   params,
              // }).then((res) => {
              //   resolve(res);
              // }).catch((error) => {
              //   reject(error);
              // });
            } catch (error) {
              reject(error);
            }
          });
        }
      }
    }
   */
  this.sInfo_SelecCoordinatesModal = function (params) {
    const { baseModal } = window.top.IBaseExpressLib;
    const {
      vue,
      controlId,
      modalParams,
      coordinatesParams
    } = { ...(params || {}) };

    let promiseResolve = null;
    let vueInstance = null;

    // 待渲染的vue组件配置
    const vueComponent = {
      className: "modalDetailWrap",
      render: (h) => {
        h = vue.$createElement;
        return h({
          template: `
            <div :id="controlId" style="text-align: center; width: 100%;">
              <div>
                <sg-input v-model="searchKeyword" id="input-search-demo2" class="search-input" placeholder="请输入关键字搜索">
                  <div slot="append">
                    <sg-icon type="iconsousuo1" size="14" style="padding: 0 10px; cursor: pointer;" @click.native="handleSearch"></sg-icon>
                  </div>
                </sg-input>
              </div>
              <sg-tree v-if="coordinatesList.length" ref="tree" :data="coordinatesList" node-key="id" default-expand-all slot-name="treeSlot" style="margin-top: 10px;" @on-node-click="handleClick">
                <template slot="treeSlot" slot-scope="node">
                  <span>{{ node.label }}</span>
                </template>
              </sg-tree>
            </div>
          `,
          data() {
            return {
              controlId: controlId,
              modalParams,
              coordinatesList: [],
              selectedCoordinate: {},
              searchKeyword: ''
            };
          },
          mounted() {
            if (promiseResolve) promiseResolve(this);
            vueInstance = this;
            this.getCoordinatesList()
          },
          methods: {
            async getCoordinatesList(...args) {
              let res = null
              res = await coordinatesParams.getCoordinatesListFun(...args)
              this.coordinatesList = res
            },
            handleClick(data, item) {
              console.log(data, item);
              this.selectedCoordinate = item;
            },
            handleSearch() {
              this.getCoordinatesList({ keyword: this.searchKeyword })
            }
          },
        });
      },
    };

    return new Promise((resolve) => {
      promiseResolve = resolve;
      // 弹窗模式
      baseModal({
        vue: vue,
        ...modalParams,
        vueComponent: vueComponent,
        getVueInstance: () => vueInstance,
      });
    });
  };
}
