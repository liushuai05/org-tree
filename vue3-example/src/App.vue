<template>
  <div>关系树</div>
  <div>
    <div class="page-content">
      <!-- <vue2-org-tree :data="data" collapsable @on-node-click="NodeClick" @on-expand="onExpand" :render-content="renderContent"  initOrg /> -->
      <OrgTree
        :data="data"
        collapsable
        @on-expand="onExpand"
        :horizontal="true"
        :render-content="renderContent"
        initOrg
      />
    </div>
  </div>
</template>
<style>
  dd {
    margin: 0;
    list-style: none;
  }
</style>

<script>

  export default {
    data: function () {
      return {
        data: 
        {
          id: 0,
          user: 'XXX科技有限公司',
          children: [
            {
              id: 2,
              user: '产品研发部',
              children: [
                {
                  id: 5,
                  user: '研发-前端',
                },
                {
                  id: 6,
                  user: '研发-后端',
                },
                {
                  id: 9,
                  user: 'UI设计',
                },
                {
                  id: 10,
                  user: '产品经理',
                },
              ],
            },
            {
              id: 3,
              user: '销售部',
              children: [
                {
                  id: 7,
                  user: '销售一部',
                },
                {
                  id: 8,
                  user: '销售二部',
                },
              ],
            },
            {
              id: 4,
              user: '财务部',
            },
            {
              id: 9,
              user: 'HR人事',
            },
          ],
        },
      };
    },
    components: {
      // 将组建加入组建库
      // 'my-component': 'url:./component/my-component.vue'
    },
    created() {
      // this.toggleExpand(this.data, true)
      this.initOrg();
    },
    methods: {
      renderContent(createElement, data) {
        console.log("data",data);
        return createElement(
          'span',
          {
            style: {
              width: '100%',
              height: '100%',
              display: 'block',
              // padding:"10px 15px",
              borderRadius: '3px',
              textAlign: 'left',
            },
          },
          [
            createElement('dd', {}, [
              createElement('img', {
                style: {
                  width: '60px',
                  height: '60px',
                },
                attrs: {
                  src: data.avatar,
                },
              }),
              
            ]),
             data.user &&
              createElement(
                'dd',
                {
                  style: {
                    fontSize: '10px',
                  },
                },
                '用户名：' + data.user
              ),
          ]
        );
      },
      // NodeClick(e,data){
      //     top.location = '{php echo webUrl('relationship/diagram')}' +'&agentid='+ data.id;
      // },
      collapse(list) {
        var _this = this;
        list.forEach(function (child) {
          if (child.expand) {
            child.expand = false;
          }
          child.children && _this.collapse(child.children);
        });
      },
      onExpand(e, data) {
        if ('expand' in data) {
          data.expand = !data.expand;
          if (!data.expand && data.children) {
            this.collapse(data.children);
          }
        } else {
          //   this.$set(data, 'expand', true);
          // 深拷贝
          this.data = JSON.parse(JSON.stringify(this.data));
        }
      },
      // toggleExpand(data, val) {
      //     var _this = this;
      //     if (Array.isArray(data)) {
      //         data.forEach(function(item) {
      //             _this.$set(item, "expand", val);
      //             if (item.children) {
      //                 _this.toggleExpand(item.children, val);
      //             }
      //         });
      //     } else {
      //         this.$set(data, "expand", val);
      //         if (data.children) {
      //             _this.toggleExpand(data.children, val);
      //         }
      //     }
      // },
      initOrg() {
        // this.$set(this.data, 'expand', true);
        // 深拷贝
        this.data = JSON.parse(JSON.stringify(this.data));
        if (this.data.children) {
          // this.data.children.forEach((item,index)=>{
          //     this.$set(item,'expand',true);
          // })
        }
      },
    },
  };
</script>
