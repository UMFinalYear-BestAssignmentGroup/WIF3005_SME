<template>
  <div class="content">
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h1 class="title">Performance</h1>
      </md-card-header>
      <md-card-content>
        <b-tabs type="is-toggle" size="is-medium" expanded>
          <b-tab-item :visible="true" label="Overall Performance">
            <md-card-content>
              <overall-performance></overall-performance>
            </md-card-content>
          </b-tab-item>

          <b-tab-item :visible="true" label="Personal Performance">
            <md-card-content>
              <personal-performance></personal-performance>
            </md-card-content>
          </b-tab-item>
        </b-tabs>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
import user from "@/js/user.js"; //directory to user.js
import personalPerformance from "@/pages/personalPerformance";
import overallPerformance from "@/pages/performance";

export default {
  data() {
    return {
      dataBackgroundColor: "blue",
    };
  },
  async created() {
    try {
      const clog = await user.check_logged();
      if (clog.err) {
        alert("User not logged in. Please login.");
        this.$router.push({ path: `/login` });
      }
    } catch (err) {
      this.error = err.message;
      alert(err);
    }
  },
  components: {
    personalPerformance,
    overallPerformance
  },
};
</script>
