<template>
  <div class="content">
    <div class="md-layout">
      <div
        class="md-layout-item md-medium-size-90 md-xsmall-size-90 md-size-90"
      >
        <table cls="clsForm">
          <tr>
            <td class="clsLabel">Year:</td>
            <td class="clsValue">
              <b-tooltip label="Previous" type="is-light" position="is-bottom">
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
            <md-icon>article</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Approved PO / Total PO</p>
            <h3 class="title">
              <span style="font-size: 30px">{{
                totalPO - totalDeclinePO
              }}</span>
              /{{ totalPO }}
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
                >{{ POefficiency }}%</span
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
        <stats-card data-background-color="orange">
          <template slot="header">
            <md-icon>article</md-icon>
          </template>

          <template slot="content">
            <p class="category">Total Approved PSR / Total PSR</p>
            <h3 class="title">
              <span style="font-size: 30px">{{
                totalPSR - totalDeclinePSR
              }}</span
              >/{{ totalPSR }}
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
        <stats-card
          :data-background-color="[
            POefficiency >= kpi_efficiency ? 'green' : 'red',
          ]"
        >
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
              {{ Math.abs(avg_po_approval - kpi_approval).toFixed(2) }} min
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="POdataDeclineChart.data"
          :chart-options="POdataDeclineChart.options"
          :chart-type="'Bar'"
          :key="componentKey"
          data-background-color="orange"
        >
          <template slot="content">
            <h4 class="title">PO Decline Per Month</h4>
            <p class="category">Purchase Order that has been rejected</p>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </chart-card>
      </div>
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
            <p class="category">Target: Less than {{ kpi_pending1 }} Min</p>
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
              {{ Math.abs(avg_po_pending1 - kpi_pending1).toFixed(2) }} min
            </div>
          </template>
        </chart-card>
      </div>
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
              {{ Math.abs(avg_po_pending2 - kpi_pending2).toFixed(2) }} min
            </div>
          </template>
        </chart-card>
      </div>

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
              {{ Math.abs(avg_psr_approval - kpi_approval).toFixed(2) }} min
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-50"
      >
        <chart-card
          :chart-data="PSRdataDeclineChart.data"
          :chart-options="PSRdataDeclineChart.options"
          :chart-type="'Bar'"
          :key="componentKey"
          data-background-color="purple"
        >
          <template slot="content">
            <h4 class="title">PSR Decline Per Month</h4>
            <p class="category">PSR that has been rejected</p>
          </template>

          <template slot="footer">
            <div class="stats">
              <md-icon>access_time</md-icon>
              {{ new Date().toLocaleString() }}
            </div>
          </template>
        </chart-card>
      </div>
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
              {{ Math.abs(avg_psr_pending1 - kpi_pending1).toFixed(2) }} min
            </div>
          </template>
        </chart-card>
      </div>
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
            <h4 class="title">Time taken for PSR Pending 2 (Min)</h4>
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
              {{ Math.abs(avg_psr_pending2 - kpi_pending2).toFixed(2) }} min
            </div>
          </template>
        </chart-card>
      </div>
      <div
        class="md-layout-item md-medium-size-100 md-xsmall-size-100 md-size-100"
      >
        <md-card>
          <md-card-header data-background-color="orange">
            <h4 class="title">Employees Stats</h4>
            <p class="category">Employees in this company</p>
          </md-card-header>
          <md-card-content>
            <b-loading
              :is-full-page="false"
              :active.sync="isLoading"
              :can-cancel="true"
            ></b-loading>
            <b-table
              :data="isEmpty ? [] : users"
              :striped="true"
              :hoverable="true"
              :paginated="true"
              :per-page="10"
              aria-next-label="Next page"
              aria-previous-label="Previous page"
              aria-page-label="Page"
              aria-current-label="Current page"
              :pagination-simple="false"
            >
              <template slot-scope="props">
                <b-table-column
                  field="id"
                  label="Username"
                  width="300"
                  sortable=""
                >
                  <a @click="detail(props.row)">
                    {{ props.row.username }}
                  </a>
                </b-table-column>
                <b-table-column
                  field="id"
                  label="Firstname"
                  width="300"
                  sortable=""
                >
                  {{ props.row.firstname }}
                </b-table-column>
                <b-table-column
                  field="id"
                  label="Lastname"
                  width="300"
                  sortable=""
                >
                  {{ props.row.lastname }}
                </b-table-column>
                <b-table-column
                  field="id"
                  label="Designation"
                  width="300"
                  sortable=""
                >
                  <span v-if="props.row.t1 == true">Level 1</span>
                  <span v-else-if="props.row.t2 == true">Level 2</span>
                  <span v-else-if="props.row.t3 == true">Level 3</span>
                  <span v-else-if="props.row.t4 == true">Level 4</span>
                  <span v-else-if="props.row.is_admin == true">Admin</span>
                  <span v-else-if="props.row.acct_t == true"
                    >Account Department</span
                  >
                  <span v-else>Invalid User</span>
                </b-table-column>
              </template>
            </b-table>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import performance from "@/js/performance.js";
import { required } from "vuelidate/lib/validators";
import { StatsCard, ChartCard } from "@/components";

export default {
  name: "overall-performance",
  components: {
    StatsCard,
    ChartCard,
  },
  data() {
    return {
      isEmpty: false,
      isLoading: false,
      id: localStorage.id,
      year: new Date().getFullYear(),
      performanceData: [],
      users: [],
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
      totalPO: 0,
      totalPSR: 0,
      POefficiency: 0,
      PSRefficiency: 0,
      totalDeclinePO: 0,
      totalDeclinePSR: 0,
      componentKey: 0,
      error: "",
      isPosted: false,
      isLoadingPage: false,

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
      POdataDeclineChart: {
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
      PSRdataDeclineChart: {
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
    };
  },
  async created() {
    try {
      this.isLoading = true;
      this.isLoadingPage = true;
      const data = await performance.get_performance(this.year);
      this.performanceData = data;
      this.getAllData(this.performanceData);
      const user = await performance.get_all_user_performance(this.year);
      this.users = user.users;
      this.isLoading = false;
      this.isLoadingPage = false;
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
    async yearChange() {
      this.isPosted = true;
      if (!this.$v.$invalid) {
        try {
          this.performanceData = [];
          this.isLoading = true;
          this.isLoadingPage = true;
          this.performanceData = await performance.get_performance(this.year);
          this.getAllData(this.performanceData);
          const user = await performance.get_all_user_performance(this.year);
          console.log(user);
          this.users = user.users;
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
    async getTotalPO(data) {
      this.totalPO = 0;
      for (let dataMonth in data.overall) {
        this.totalPO +=
          data.overall[dataMonth].total_po == null
            ? 0
            : parseInt(data.overall[dataMonth].total_po);
      }
    },

    async getPOEfficiency(data) {
      let totalEfficiency = 0;
      this.POefficiency = 0;
      let monthCount = 0;
      for (let dataMonth in data.overall) {
        totalEfficiency +=
          data.overall[dataMonth].po_efficiency == null
            ? 0
            : parseInt(data.overall[dataMonth].po_efficiency);
        if (parseInt(data.overall[dataMonth].psr_efficiency) != 0) {
          monthCount += 1;
        }
      }
      this.POefficiency = (totalEfficiency / monthCount).toFixed(2);
    },

    async getTotalDeclinePO(data) {
      this.totalDeclinePO = 0;
      for (let dataMonth in data.overall) {
        this.totalDeclinePO +=
          data.overall[dataMonth].total_po_decline == null
            ? 0
            : parseInt(data.overall[dataMonth].total_po_decline);
      }
    },
    async getTotalPSR(data) {
      this.totalPSR = 0;
      for (let dataMonth in data.overall) {
        this.totalPSR +=
          data.overall[dataMonth].total_psr == null
            ? 0
            : parseInt(data.overall[dataMonth].total_psr);
      }
    },

    async getPSREfficiency(data) {
      let totalEfficiency = 0;
      this.PSRefficiency = 0;
      let monthCount = 0;
      for (let dataMonth in data.overall) {
        totalEfficiency +=
          data.overall[dataMonth].psr_efficiency == null
            ? 0
            : parseInt(data.overall[dataMonth].psr_efficiency);
        if (parseInt(data.overall[dataMonth].psr_efficiency) != 0) {
          monthCount += 1;
        }
      }
      this.PSRefficiency = (totalEfficiency / monthCount).toFixed(2);
    },

    async getTotalDeclinePSR(data) {
      this.totalDeclinePSR = 0;
      for (let dataMonth in data.overall) {
        this.totalDeclinePSR +=
          data.overall[dataMonth].total_psr_decline == null
            ? 0
            : parseInt(data.overall[dataMonth].total_psr_decline);
      }
    },

    async getPOPendingOneseries(data) {
      this.POpendingOneChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_po.pending_1.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_po.pending_1.minutes)
        );
      }
      this.POpendingOneChart.options.high = Math.max.apply(Math, series) + 50;
      this.POpendingOneChart.data.series.push(series);
      this.forceRender();
    },
    async getPOPendingTwoseries(data) {
      this.POpendingTwoChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_po.pending_2.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_po.pending_2.minutes)
        );
      }
      this.POpendingTwoChart.data.series.push(series);
      this.POpendingTwoChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPOApprovalseries(data) {
      this.POapprovalChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_po.approve.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_po.approve.minutes)
        );
      }
      this.POapprovalChart.data.series.push(series);
      this.POapprovalChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPODeclineseries(data) {
      this.POdataDeclineChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_po.decline.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_po.decline.minutes)
        );
      }
      this.POdataDeclineChart.data.series.push(series);
      this.POdataDeclineChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPSRPendingOneseries(data) {
      this.PSRpendingOneChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_psr.pending_1.minutes == null
            ? 0
            : parseInt(
                data.overall[dataMonth].tmp_average_psr.pending_1.minutes
              )
        );
      }
      this.PSRpendingOneChart.data.series.push(series);
      this.PSRpendingOneChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPSRPendingTwoseries(data) {
      this.PSRpendingTwoChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_psr.pending_2.minutes == null
            ? 0
            : parseInt(
                data.overall[dataMonth].tmp_average_psr.pending_2.minutes
              )
        );
      }
      this.PSRpendingTwoChart.data.series.push(series);
      this.PSRpendingTwoChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPSRApprovalseries(data) {
      this.PSRapprovalChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_psr.approve.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_psr.approve.minutes)
        );
      }
      this.PSRapprovalChart.data.series.push(series);
      this.PSRapprovalChart.options.high = Math.max.apply(Math, series) + 50;
      this.forceRender();
    },
    async getPSRDeclineseries(data) {
      this.PSRdataDeclineChart.data.series.pop();
      let series = Array();
      for (let dataMonth in data.overall) {
        series.push(
          data.overall[dataMonth].tmp_average_psr.decline.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_psr.decline.minutes)
        );
      }
      this.PSRdataDeclineChart.data.series.push(series);
      this.PSRdataDeclineChart.options.high = Math.max.apply(Math, series) + 50;
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

      for (let dataMonth in data.overall) {
        po_pending1 +=
          data.overall[dataMonth].tmp_average_po.pending_1.minutes == null
            ? 0
            : parseInt(
                data.overall[dataMonth].tmp_average_po.pending_1.minutes
              );
        po_pending2 +=
          data.overall[dataMonth].tmp_average_po.pending_2.minutes == null
            ? 0
            : parseInt(
                data.overall[dataMonth].tmp_average_po.pending_2.minutes
              );
        po_approval +=
          data.overall[dataMonth].tmp_average_po.approve.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_po.approve.minutes);

        psr_pending1 +=
          data.overall[dataMonth].tmp_average_psr.pending_1.minutes == null
            ? 0
            : parseInt(
                data.overall[dataMonth].tmp_average_psr.pending_1.minutes
              );
        psr_pending2 +=
          data.overall[dataMonth].tmp_average_psr.pending_2.minutes == null
            ? 0
            : parseInt(
                data.overall[dataMonth].tmp_average_psr.pending_2.minutes
              );
        psr_approval +=
          data.overall[dataMonth].tmp_average_psr.approve.minutes == null
            ? 0
            : parseInt(data.overall[dataMonth].tmp_average_psr.approve.minutes);
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
      console.log(this.reach_kpi_po_pending1);
    },
    forceRender() {
      this.componentKey += 1;
    },
    async getAllData(data) {
      await this.getTotalPO(data);
      await this.getPOEfficiency(data);
      await this.getTotalDeclinePO(data);
      await this.getTotalPSR(data);
      await this.getPSREfficiency(data);
      await this.getTotalDeclinePSR(data);

      await this.getPOApprovalseries(data);
      await this.getPODeclineseries(data);
      await this.getPOPendingOneseries(data);
      await this.getPOPendingTwoseries(data);

      await this.getPSRApprovalseries(data);
      await this.getPSRDeclineseries(data);
      await this.getPSRPendingOneseries(data);
      await this.getPSRPendingTwoseries(data);

      await this.getKPI(data);
    },
    async getUser() {},
    detail(value) {
      console.log(value.id);
      this.$router.push({
        path: `/userPerformance/${this.id}/${value.id}`,
      });
    },
    openLoading() {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 10 * 1000);
    },
    async nextPage() {
      this.isPrevious = false;
      if (this.page >= this.total_page - 1) {
        this.page = this.total_page;
      } else this.page += 1;
      if (this.page == this.total_page) this.isNext = true;

      this.poObj.in_page = this.page;
      this.getUser();
    },
    async previousPage() {
      this.isNext = false;
      if (this.page <= 1) {
        this.page = 1;
        this.isPrevious = true;
      } else this.page -= 1;
      if (this.page == 1) this.isPrevious = true;

      this.poObj.in_page = this.page;
      this.getUser();
    },
    async pagination() {
      if (this.page >= this.total_page) {
        this.page = this.total_page;
        this.isNext = false;
      } else if (this.page < 1) {
        this.page = 1;
        this.isPrevious = false;
      } else this.page = 1;

      this.poObj.in_page = this.page;
      this.getUser();
    },
  },
  watch: {
    year() {
      this.yearChange();
    },
  },
};
</script>