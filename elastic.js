'use strict';


const store = new Vuex.Store({
  state: {
    dragging: false,
    controlPoint: {
      x: 160,
      y: 160
    },
    startPoint: {
      x: 0,
      y: 0
    }
  },
  getters: {
    headerPath: state => {
      let c = state.controlPoint;
      return 'M0,0 L320,0 320,160' + 'Q' + c.x + ',' + c.y + ' 0,160';
    },
    contentPosition: state => {
      let dy = state.controlPoint.y - 160;
      return {
        transform: 'translate3d(0,' + dy / (dy > 0 ? 2 : 4) + 'px,0)'
      };
    }
  },
  mutations: {
    startDrag: (state, e) => {
      e = e.changedTouches ? e.changedTouches[0] : e;
      state.dragging = true;
      state.startPoint.x = e.pageX;
      state.startPoint.y = e.pageY;
    },

    onDrag: (state, e) => {
      e = e.changedTouches ? e.changedTouches[0] : e;
        if (state.dragging) {
          state.controlPoint.x = 160 + (e.pageX - state.startPoint.x);
          let dy = e.pageY - state.startPoint.y;
          state.controlPoint.y = 160 + dy / (dy > 0 ? 1.5 : 4);
        }
    },

    stopDrag: state => {
      if (state.dragging) {
        state.dragging = false;
        dynamics.animate(state.controlPoint, {
          x: 160,
          y: 160
        }, {
          type: dynamics.spring,
          duration: 700,
          fraction: 280
        })
      }
    }
  },

  actions: {
    startDrag: ({commit}, e) => commit('startDrag', e),
    onDrag: ({commit}, e) => commit('onDrag', e),
    stopDrag: ({commit}) => commit('stopDrag')
  }
});


const component = {
  computed: Vuex.mapGetters([
    'headerPath', 'contentPosition'
  ]),
  methods: Vuex.mapActions([
    'startDrag', 'onDrag', 'stopDrag'
  ]),
  template: `
    <div class="draggable-header-view"
      @mousedown="startDrag" @touchstart="startDrag"
      @mousemove="onDrag" @touchmove="onDrag"
      @mouseup="stopDrag" @touchend="stopDrag"
      @mouseleave="stopDrag">
      <svg class="bg" width="320" height="560">
        <path :d="headerPath" fill="#3f51b5"></path>
      </svg>
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="content" :style="contentPosition">
        <slot name="content"></slot>
      </div>
    </div>
  `
};


const app = new Vue({
  el: '#app',
  store,
  components: {
    'draggableHeaderView': component
  },
  template: `
    <div id="app" @touchmove.prevent>
      <draggable-header-view>
        <template slot="header">
          <h1>Elastic Draggable SVG Header</h1>
          <p>
            with <a href="http://vuejs.org">Vue.js</a>
            + <a href="http://dynamicsjs.com">dynamics.js</a>
          </p>
        </template>
        <template slot="content">
          <p>
            Note this is just an effect demo - there are of
            course many additional details if you want to use this
            in production, e.g. handling responsive sizes, reload
            threshold and content scrolling. Those are out of scope
            for this quick little hack. However, the idea is that
            you can hide them as internal details of a Vue.js
            component and expose a simple Web-Component-like
            interface.
          </p>
        </template>
      </draggable-header-view>
    </div>
  `
});
