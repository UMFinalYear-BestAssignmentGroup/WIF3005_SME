<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-90 md-xsmall-size-90 md-size-90"
      >
        <h1 style="margin-left: 10px; font-size: 35px">
          {{ userName }} {{ userTier }}
        </h1>

        <div
          class="md-layout-item md-medium-size-90 md-xsmall-size-90 md-size-90"
        >
          <table cls="clsForm">
            <tr>
              <td class="clsLabel">Year:</td>
              <td class="clsValue">
                <b-tooltip
                  label="Previous"
                  type="is-light"
                  position="is-bottom"
                >
                  <b-button
                    @click="year--"
                    size="is-small"
                    float="right"
                    type="is-light"
                  >
                    <md-icon>navigate_before</md-icon>
                  </b-button>
                </b-tooltip>
              </td>
              <td class="clsValue">
                <b-input v-model="year" style="width: 98%"></b-input>
                <div class="error" v-if="!$v.year.required && isPosted">
                  Year is required
                </div>
              </td>
              <td class="clsValue">
                <b-tooltip label="Next" type="is-light" position="is-bottom">
                  <b-button
                    @click="year == new Date().getFullYear() ? year : year++"
                    size="is-small"
                    float="right"
                    type="is-light"
                  >
                    <md-icon>navigate_next</md-icon>
                  </b-button>
                  &nbsp;&nbsp;
                </b-tooltip>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <b-loading
        :is-full-page="false"
        :active.sync="isLoadingPage"
        :can-cancel="true"
      ></b-loading>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>description</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Submitted PO</p>
            <h3 class="title">{{ totalSubmittedPO }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </stats-card>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>article</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Approved PO</p>
            <h3 class="title">{{ totalPO - totalDeclinePO }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>assignment</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Declined PO</p>
            <h3 class="title">{{ totalDeclinePO }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </stats-card>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card
          :data-background-color="[
            POefficiency >= kpi_efficiency ? 'green' : 'red',
          ]"
        >
          <template slot="header">
            <md-icon>work</md-icon>
          </template>

          <template slot="content">
            <p class="category">Efficiency for PO Approval</p>
            <h3 class="title">
              <span
                :style="[
                  POefficiency >= kpi_efficiency ? {} : { color: '#FF0000' },
                ]"
                style="font-size: 30px"
                >{{ POefficiency }}%
              </span>
              <span>
                <br />
                <small>Target: {{ kpi_efficiency }}%</small>
              </span>
            </h3>
          </template>

          <template slot="footer">
            <div
              class="stats"
              :style="[
                POefficiency >= kpi_efficiency
                  ? { color: 'green' }
                  : { color: '#FF0000' },
              ]"
              style="font-weight: bold"
            >
              <md-icon
                :style="[
                  POefficiency >= kpi_efficiency
                    ? { color: 'green' }
                    : { color: '#FF0000' },
                ]"
                >{{
                  POefficiency >= kpi_efficiency
                    ? "trending_up"
                    : "trending_down"
                }}</md-icon
              >
              {{ Math.abs(POefficiency - kpi_efficiency) }}%
            </div>
          </template>
        </stats-card>
      </div>

      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>description</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Submitted PSR</p>
            <h3 class="title">{{ totalSubmittedPSR }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>article</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Approved PSR</p>
            <h3 class="title">
              {{ totalPSR - totalDeclinePSR }}
            </h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>assignment</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Decline PSR</p>
            <h3 class="title">{{ totalDeclinePSR }}</h3>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>date_range</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </stats-card>
      </div>
      <div
        class="md-layout-item md-medium-size-50 md-xsmall-size-100 md-size-25"
      >
        <stats-card data-background-color="purple">
          <template slot="header">
            <md-icon>work</md-icon>
          </template>

          <template slot="content">
            <p class="category">Efficiency for PSR Approval</p>
            <h3 class="title">
              <span
                :style="[
                  PSRefficiency >= kpi_efficiency ? {} : { color: '#FF0000' },
                ]"
                style="font-size: 30px"
                >{{ PSRefficiency }}%</span
              >
              <span>
                <br />
                <small>Target: {{ kpi_efficiency }}%</small>
              </span>
            </h3>
          </template>

          <template slot="footer">
            <div
              class="stats"
              :style="[
                PSRefficiency >= kpi_efficiency
                  ? { color: 'green' }
                  : { color: '#FF0000' },
              ]"
              style="font-weight: bold"
            >
              <md-icon
                :style="[
                  PSRefficiency >= kpi_efficiency
                    ? { color: 'green' }
                    : { color: '#FF0000' },
                ]"
                >{{
                  PSRefficiency >= kpi_efficiency
                    ? "trending_up"
                    : "trending_down"
                }}</md-icon
              >
              {{ Math.abs(PSRefficiency - kpi_efficiency) }}%
            </div>
          </template>
        </stats-card>
      </div>
      <template v-if="getTier === 't4'">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
        >
          <chart-card
            :chart-data="POapprovalChart.data"
            :chart-options="POapprovalChart.options"
            :chart-responsive-options="POapprovalChart.responsiveOptions"
            :chart-type="'Bar'"
            :key="componentKey"
            :data-background-color="[
              avg_po_approval > kpi_approval ? 'red' : 'orange',
            ]"
          >
            <template slot="content">
              <h4 class="title">Time Taken for PO Approval Per Month (Min)</h4>
              <p class="category">Target: Less than {{ kpi_approval }} Min</p>
            </template>

            <template slot="footer">
              <div
                class="stats"
                :style="[
                  avg_po_approval > kpi_approval
                    ? { color: '#FF0000' }
                    : { color: 'green' },
                ]"
                style="font-weight: bold"
              >
                <md-icon
                  :style="[
                    avg_po_approval > kpi_approval
                      ? { color: '#FF0000' }
                      : { color: 'green' },
                  ]"
                  >{{
                    avg_po_approval > kpi_approval
                      ? "trending_down"
                      : "trending_up"
                  }}</md-icon
                >
                {{ Math.abs(avg_po_approval - kpi_approval) }} min
              </div>
            </template>
          </chart-card>
        </div>
      </template>

      <template v-if="getTier === 't2'">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
        >
          <chart-card
            :chart-data="POpendingOneChart.data"
            :chart-options="POpendingOneChart.options"
            :chart-type="'Line'"
            :key="componentKey"
            :data-background-color="[
              avg_po_pending1 > kpi_pending1 ? 'red' : 'orange',
            ]"
          >
            <template slot="content">
              <h4 class="title">Time Taken for PO Pending 1 (Min)</h4>
              <p class="category">Target: Less than {{ kpi_pending1 }}</p>
            </template>

            <template slot="footer">
              <div
                class="stats"
                :style="[
                  avg_po_pending1 > kpi_pending1
                    ? { color: '#FF0000' }
                    : { color: 'green' },
                ]"
                style="font-weight: bold"
              >
                <md-icon
                  :style="[
                    avg_po_pending1 > kpi_pending1
                      ? { color: '#FF0000' }
                      : { color: 'green' },
                  ]"
                  >{{
                    avg_po_pending1 > kpi_pending1
                      ? "trending_down"
                      : "trending_up"
                  }}</md-icon
                >
                {{ Math.abs(avg_po_pending1 - kpi_pending1) }} min
              </div>
            </template>
          </chart-card>
        </div>
      </template>
      <template v-if="getTier === 't3'">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
        >
          <chart-card
            :chart-data="POpendingTwoChart.data"
            :chart-options="POpendingTwoChart.options"
            :chart-type="'Line'"
            :key="componentKey"
            :data-background-color="[
              avg_po_pending2 > kpi_pending2 ? 'red' : 'orange',
            ]"
          >
            <template slot="content">
              <h4 class="title">Time Taken for PO Pending 2 (Min)</h4>
              <p class="category">Target: Less than {{ kpi_pending2 }}</p>
            </template>

            <template slot="footer">
              <div
                class="stats"
                :style="[
                  avg_po_pending2 > kpi_pending2
                    ? { color: '#FF0000' }
                    : { color: 'green' },
                ]"
                style="font-weight: bold"
              >
                <md-icon
                  :style="[
                    avg_po_pending2 > kpi_pending2
                      ? { color: '#FF0000' }
                      : { color: 'green' },
                  ]"
                  >{{
                    avg_po_pending2 > kpi_pending2
                      ? "trending_down"
                      : "trending_up"
                  }}</md-icon
                >
                {{ Math.abs(avg_po_pending2 - kpi_pending2) }} min
              </div>
            </template>
          </chart-card>
        </div>
      </template>
      <template v-if="getTier === 't4'">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
        >
          <chart-card
            :chart-data="PSRapprovalChart.data"
            :chart-options="PSRapprovalChart.options"
            :chart-responsive-options="PSRapprovalChart.responsiveOptions"
            :chart-type="'Bar'"
            :key="componentKey"
            :data-background-color="[
              avg_psr_approval > kpi_approval ? 'red' : 'purple',
            ]"
          >
            <template slot="content">
              <h4 class="title">Time Taken for PSR Approval Per Month (Min)</h4>
              <p class="category">Target: Less than {{ kpi_approval }} Min</p>
            </template>

            <template slot="footer">
              <div
                class="stats"
                :style="[
                  avg_psr_approval > kpi_approval
                    ? { color: '#FF0000' }
                    : { color: 'green' },
                ]"
                style="font-weight: bold"
              >
                <md-icon
                  :style="[
                    avg_psr_approval > kpi_approval
                      ? { color: '#FF0000' }
                      : { color: 'green' },
                  ]"
                  >{{
                    avg_psr_approval > kpi_approval
                      ? "trending_down"
                      : "trending_up"
                  }}</md-icon
                >
                {{ Math.abs(avg_psr_approval - kpi_approval) }} min
              </div>
            </template>
          </chart-card>
        </div>
      </template>

      <template v-if="getTier === 't2'">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
        >
          <chart-card
            :chart-data="PSRpendingOneChart.data"
            :chart-options="PSRpendingOneChart.options"
            :chart-type="'Line'"
            :key="componentKey"
            :data-background-color="[
              avg_psr_pending1 > kpi_pending1 ? 'red' : 'purple',
            ]"
          >
            <template slot="content">
              <h4 class="title">Time Taken for PSR Pending 1 (Min)</h4>
              <p class="category">Target: Less than {{ kpi_pending1 }}</p>
            </template>

            <template slot="footer">
              <div
                class="stats"
                :style="[
                  avg_psr_pending1 > kpi_pending1
                    ? { color: '#FF0000' }
                    : { color: 'green' },
                ]"
                style="font-weight: bold"
              >
                <md-icon
                  :style="[
                    avg_psr_pending1 > kpi_pending1
                      ? { color: '#FF0000' }
                      : { color: 'green' },
                  ]"
                  >{{
                    avg_psr_pending1 > kpi_pending1
                      ? "trending_down"
                      : "trending_up"
                  }}</md-icon
                >
                {{ Math.abs(avg_psr_pending1 - kpi_pending1) }} min
              </div>
            </template>
          </chart-card>
        </div>
      </template>
      <template v-if="getTier === 't3'">
        <div
          class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
        >
          <chart-card
            :chart-data="PSRpendingTwoChart.data"
            :chart-options="PSRpendingTwoChart.options"
            :chart-type="'Line'"
            :key="componentKey"
            :data-background-color="[
              avg_psr_pending2 > kpi_pending2 ? 'red' : 'purple',
            ]"
          >
            <template slot="content">
              <h4 class="title">Time Taken for PSR Pending 2 (Min)</h4>
              <p class="category">Target: Less than {{ kpi_pending2 }}</p>
            </template>

            <template slot="footer">
              <div
                class="stats"
                :style="[
                  avg_psr_pending2 > kpi_pending2
                    ? { color: '#FF0000' }
                    : { color: 'green' },
                ]"
                style="font-weight: bold"
              >
                <md-icon
                  :style="[
                    avg_psr_pending2 > kpi_pending2
                      ? { color: '#FF0000' }
                      : { color: 'green' },
                  ]"
                  >{{
                    avg_psr_pending2 > kpi_pending2
                      ? "trending_down"
                      : "trending_up"
                  }}</md-icon
                >
                {{ Math.abs(avg_psr_pending2 - kpi_pending2) }} min
              </div>
            </template>
          </chart-card>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import performance from "@/js/performance.js";
import { required } from "vuelidate/lib/validators";
import { StatsCard, ChartCard } from "@/components";
import sleep from "await-sleep";

export default {
  name: "personal-performance",
  components: {
    StatsCard,
    ChartCard,
  },
  data() {
    return {
      isEmpty: false,
      isLoading: false,
      isLoadingPage: false,
      id: localStorage.id,
      year: new Date().getFullYear(),
      usersData: [],
      userName: "",
      userTier: "",
      getTier: "",
      performanceData: [],
      totalSubmittedPO: 0,
      totalSubmittedPSR: 0,
      totalPO: 0,
      totalPSR: 0,
      POefficiency: 0,
      PSRefficiency: 0,
      totalDeclinePO: 0,
      totalDeclinePSR: 0,
      componentKey: 0,
      error: "",
      isPosted: false,
      kpi_efficiency: 82,
      kpi_pending1: 900,
      kpi_pending2: 800,
      kpi_approval: 650,
      avg_po_pending1: 0,
      avg_po_pending2: 0,
      avg_po_approval: 0,
      avg_psr_pending1: 0,
      avg_psr_pending2: 0,
      avg_psr_approval: 0,

      POpendingOneChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 250,
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      POpendingTwoChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 250, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      POapprovalChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 250,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },

      PSRpendingOneChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 250, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      PSRpendingTwoChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [],
        },
        options: {
          lineSmooth: this.$Chartist.Interpolation.cardinal({
            tension: 0,
          }),
          low: 0,
          high: 250, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
      },
      PSRapprovalChart: {
        data: {
          labels: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          series: [],
        },
        options: {
          axisX: {
            showGrid: false,
          },
          low: 0,
          high: 250,
          chartPadding: {
            top: 0,
            right: 5,
            bottom: 0,
            left: 0,
          },
        },
        responsiveOptions: [
          [
            "screen and (max-width: 640px)",
            {
              seriesBarDistance: 5,
              axisX: {
                labelInterpolationFnc: function (value) {
                  return value[0];
                },
              },
            },
          ],
        ],
      },
    };
  },
  async created() {
    try {
      this.isLoading = true;
      this.isLoadingPage = true;
      this.user_id = this.id;
      const data = await performance.get_all_user_performance(this.year);
      this.usersData = data.user_data;
      await this.get_performance_data(this.usersData);
      this.getAllData(this.performanceData);
      this.isLoading = false;
      this.isLoadingPage = false;
      this.renderInterval()
    } catch (err) {
      this.isLoading = false;
      this.isLoadingPage = false;
      this.error = err.message;
    }
  },
  
  validations: {
    year: {
      required,
    },
  },
  methods: {
    async renderInterval(){
      for(var i=0; i<7; i++){
        await sleep(2000);
        this.forceRender();
        console.log("Interval")
      }
    },
    async get_performance_data(data) {
      for (let user in data) {
        if (this.user_id == data[user].id) {
          this.performanceData = data[user].performance;
          this.userName = data[user].lastname + " " + data[user].firstname;
          if (data[user].t1 == true) {
            this.userTier = "(Level 1)";
            this.getTier = "t1";
          } else if (data[user].t2 == true) {
            this.userTier = "(Level 2)";
            this.getTier = "t2";
          } else if (data[user].t3 == true) {
            this.userTier = "(Level 3)";
            this.getTier = "t3";
          } else if (data[user].t4 == true) {
            this.userTier = "(Level 4)";
            this.getTier = "t4";
          } else if (data[user].is_admin == true) {
            this.userTier = "(Admin)";
            this.getTier = "admin";
          } else if (data[user].acct_t == true) {
            this.userTier = "(Account Department)";
            this.getTier = "account";
          } else {
            this.userTier = "(Invalid User)";
            this.getTier = "invalid";
          }
        }
      }
    },
    async yearChange() {
      this.isPosted = true;
      if (!this.$v.$invalid) {
        try {
          this.performanceData = [];
          this.isLoading = true;
          this.isLoadingPage = true;
          const data = await performance.get_all_user_performance(this.year);
          this.usersData = data.user_data;
          await this.get_performance_data(this.usersData);
          this.getAllData(this.performanceData);
          this.isLoading = false;
          this.isLoadingPage = false;
        } catch (err) {
          this.isLoading = false;
          this.isLoadingPage = false;
          alert(err);
          this.error = err.message;
        }
      } else alert("Fill the required fields");
    },
    async getPOData(data) {
      this.totalPO = 0;
      this.totalSubmittedPO =
        data[0].po_total_submitted == null
          ? 0
          : parseInt(data[0].po_total_submitted);
      let totalEfficiency = 0;
      this.POefficiency = 0;
      let monthCount = 0;
      this.totalDeclinePO = 0;

      for (let dataMonth in data) {
        this.totalPO +=
          data[dataMonth].total_po == null
            ? 0
            : parseInt(data[dataMonth].total_po);

        totalEfficiency +=
          data[dataMonth].po_efficiency == null
            ? 0
            : parseInt(data[dataMonth].po_efficiency);
        if (parseInt(data[dataMonth].po_efficiency) != 0) {
          monthCount += 1;
        }
        this.totalDeclinePO +=
          data[dataMonth].total_po_decline == null
            ? 0
            : parseInt(data[dataMonth].total_po_decline);
      }
      this.POefficiency = (totalEfficiency / monthCount).toFixed(2);
    },
    async getPSRData(data) {
      this.totalPSR = 0;
      this.totalSubmittedPSR =
        data[0].psr_total_submitted == null
          ? 0
          : parseInt(data[0].psr_total_submitted);
      let totalEfficiency = 0;
      this.PSRefficiency = 0;
      let monthCount = 0;
      this.totalDeclinePSR = 0;
      for (let dataMonth in data) {
        this.totalPSR +=
          data[dataMonth].total_psr == null
            ? 0
            : parseInt(data[dataMonth].total_psr);

        totalEfficiency +=
          data[dataMonth].psr_efficiency == null
            ? 0
            : parseInt(data[dataMonth].psr_efficiency);
        if (parseInt(data[dataMonth].psr_efficiency) != 0) {
          monthCount += 1;
        }
        this.totalDeclinePSR +=
          data[dataMonth].total_psr_decline == null
            ? 0
            : parseInt(data[dataMonth].total_psr_decline);
      }
      this.PSRefficiency = (totalEfficiency / monthCount).toFixed(2);
    },

    async getPOPendingOneseries(data) {
      this.POpendingOneChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data) {
        series.push(
          data[dataMonth].tmp_average_po.pending_1.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_po.pending_1.minutes)
        );
      }
      this.POpendingOneChart.options.high = Math.max.apply(Math, series) + 50;
      this.POpendingOneChart.data.series.push(series);
      this.forceRender();
    },
    async getPOPendingTwoseries(data) {
      this.POpendingTwoChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data) {
        series.push(
          data[dataMonth].tmp_average_po.pending_2.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_po.pending_2.minutes)
        );
      }
      this.POpendingTwoChart.data.series.push(series);
      this.POpendingTwoChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPOApprovalseries(data) {
      this.POapprovalChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data) {
        series.push(
          data[dataMonth].tmp_average_po.approve.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_po.approve.minutes)
        );
      }
      this.POapprovalChart.data.series.push(series);
      this.POapprovalChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },

    async getPSRPendingOneseries(data) {
      this.PSRpendingOneChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data) {
        series.push(
          data[dataMonth].tmp_average_psr.pending_1.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_psr.pending_1.minutes)
        );
      }
      this.PSRpendingOneChart.data.series.push(series);
      this.PSRpendingOneChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPSRPendingTwoseries(data) {
      this.PSRpendingTwoChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data) {
        series.push(
          data[dataMonth].tmp_average_psr.pending_2.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_psr.pending_2.minutes)
        );
      }
      this.PSRpendingTwoChart.data.series.push(series);
      this.PSRpendingTwoChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPSRApprovalseries(data) {
      this.PSRapprovalChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data) {
        series.push(
          data[dataMonth].tmp_average_psr.approve.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_psr.approve.minutes)
        );
      }
      this.PSRapprovalChart.data.series.push(series);
      this.PSRapprovalChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getKPI(data) {
      let po_pending1 = 0;
      let po_pending2 = 0;
      let po_approval = 0;
      let psr_pending1 = 0;
      let psr_pending2 = 0;
      let psr_approval = 0;

      this.avg_po_pending1 = 0;
      this.avg_po_pending2 = 0;
      this.avg_po_approval = 0;
      this.avg_psr_pending1 = 0;
      this.avg_psr_pending2 = 0;
      this.avg_psr_approval = 0;

      for (let dataMonth in data) {
        po_pending1 +=
          data[dataMonth].tmp_average_po.pending_1.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_po.pending_1.minutes);
        po_pending2 +=
          data[dataMonth].tmp_average_po.pending_2.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_po.pending_2.minutes);
        po_approval +=
          data[dataMonth].tmp_average_po.approve.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_po.approve.minutes);

        psr_pending1 +=
          data[dataMonth].tmp_average_psr.pending_1.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_psr.pending_1.minutes);
        psr_pending2 +=
          data[dataMonth].tmp_average_psr.pending_2.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_psr.pending_2.minutes);
        psr_approval +=
          data[dataMonth].tmp_average_psr.approve.minutes == null
            ? 0
            : parseInt(data[dataMonth].tmp_average_psr.approve.minutes);
      }
      if (this.year == new Date().getFullYear()) {
        this.avg_po_pending1 =
          po_pending1 / parseInt(new Date().getMonth() + 1);
        this.avg_po_pending2 =
          po_pending2 / parseInt(new Date().getMonth() + 1);
        this.avg_po_approval =
          po_approval / parseInt(new Date().getMonth() + 1);
        this.avg_psr_pending1 =
          psr_pending1 / parseInt(new Date().getMonth() + 1);
        this.avg_psr_pending2 =
          psr_pending2 / parseInt(new Date().getMonth() + 1);
        this.avg_psr_approval =
          psr_approval / parseInt(new Date().getMonth() + 1);
      } else if (this.year < new Date().getFullYear()) {
        this.avg_po_pending1 = po_pending1 / 12;
        this.avg_po_pending2 = po_pending2 / 12;
        this.avg_po_approval = po_approval / 12;
        this.avg_psr_pending1 = psr_pending1 / 12;
        this.avg_psr_pending2 = psr_pending2 / 12;
        this.avg_psr_approval = psr_approval / 12;
      }
    },

    forceRender() {
      this.componentKey += 1;
    },
    async getAllData(data) {
      await this.getPOData(data);

      await this.getPSRData(data);

      await this.getPOApprovalseries(data);
      await this.getPOPendingOneseries(data);
      await this.getPOPendingTwoseries(data);

      await this.getPSRApprovalseries(data);
      await this.getPSRPendingOneseries(data);
      await this.getPSRPendingTwoseries(data);

      await this.getKPI(data);
    },
  },
  watch: {
    year() {
      this.yearChange();
    },
  },
};
</script>
