import Mustache from 'mustache';
import { debounce } from 'lodash';

const broadcastEvent = '.Illuminate\\\\Notifications\\\\Events\\\\BroadcastNotificationCreated';

export default {
  data() {
    return {
    };
  },
  methods: {
    queueWatcherSync(watcher) {
      if (watcher.synchronous) {
        // lock screen with watcher's popup
        if (this.$el.offsetParent) {
          this.$parent.$refs.watchersSynchronous.show(watcher.name);
        }
      }
      return new Promise((complete, exception) => {
        const input = Mustache.render(watcher.input_data, this.vdata);
        const config = Mustache.render(watcher.script_configuration, this.vdata);
        
        let scriptId = watcher.script_id;
        if (watcher.script_key) {
          scriptId = watcher.script_key;
        }
        this.$dataProvider.postScript(scriptId, {
          watcher: watcher.uid,
          data: input,
          config,
          sync: true,
        }, { timeout: 0 }).then(response => {
          complete(response.data.output);
        }).catch(err => {
          exception(err);
        });
      }).then((response) => {
        if (watcher.output_variable) {
          this.setValue(watcher.output_variable, response);
        }

        //update mapped values
        let watcherConf = JSON.parse (watcher.script_configuration);
        let mapping = watcherConf.dataMapping || [];

        mapping.forEach(map => {
          if (typeof this.getValue(`${map.key}_was_filled__`) !== 'undefined') {
            // If the variable already exist it must be set as filled and updated
            this.setValue(`${map.key}_was_filled__`, true);
            this.setValue(map.key, response[map.key]);
          }
          else {
            // If it is a new variable, the value  is set directly
            this.$set(this.vdata, map.key, response[map.key]);
          }
        }, this);

        // hide watcher's popup
        if (this.$parent.$refs.watchersSynchronous) {
          this.$parent.$refs.watchersSynchronous.hide(watcher.name);
        }
        return response;
      }).catch(error => {
        if (watcher.synchronous) {
          this.$parent.$refs.watchersSynchronous.error(error);
        } else {
          window.ProcessMaker.alert(error, 'danger');
        }
      });
    },
  },
  mounted() {
    this.queueWatcher = debounce(this.queueWatcherSync, window.ProcessMaker.watchersDebounce || 1000);
  },
};