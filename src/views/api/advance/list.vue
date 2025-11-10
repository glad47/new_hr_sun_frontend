<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="120px">
      <el-form-item label="معرف الموظف" prop="empId">
        <el-input
          v-model="queryParams.empId"
          placeholder="أدخل معرف الموظف"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="تاريخ تقديم الطلب" prop="requestDate">
        <el-date-picker
          clearable
          v-model="queryParams.requestDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="اختر تاريخ تقديم الطلب">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="المبلغ المطلوب" prop="amount">
        <el-input
          v-model="queryParams.amount"
          placeholder="أدخل المبلغ المطلوب"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="عدد الأشهر للتقسيط" prop="months">
        <el-input
          v-model="queryParams.months"
          placeholder="أدخل عدد الأشهر للتقسيط"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>


      <el-form-item label="حالة الطلب" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="اختر حالة الطلب"
          clearable
          @change="handleQuery"
        >
          <el-option label="قيد الانتظار" value="0" />
          <el-option label="موافق عليه" value="1" />
          <el-option label="مرفوض" value="2" />
        </el-select>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">بحث</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">إعادة تعيين</el-button>
      </el-form-item>
    </el-form>


    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['api:advance:add']"
        >إضافة</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['api:advance:edit']"
        >تعديل</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['api:advance:remove']"
        >حذف</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['api:advance:export']"
        >تصدير</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>



    <div style="margin-bottom: 20px; font-size: 18px; font-weight: bold;">
      بيانات السلف الخاصة بالموظف: {{ employeeName || 'جارٍ التحميل...' }}
    </div>


    <el-table v-loading="loading" :data="advanceList" @selection-change="handleSelectionChange" @row-click="goToInstallment">
      <el-table-column type="selection" width="55" align="center" />
      
      <el-table-column label="المعرف الفريد للسلفة" align="center" prop="id" />
       <el-table-column label="اسم الموظف" align="center">
        <template slot-scope="scope">
          {{ employeeName }}
        </template>
      </el-table-column>
      
      <el-table-column label="تاريخ تقديم الطلب" align="center" prop="requestDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requestDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      
      <el-table-column label="المبلغ المطلوب" align="center" prop="amount" />
      <el-table-column label="عدد الأشهر للتقسيط" align="center" prop="months" />
      <el-table-column label="سبب الطلب" align="center" prop="reason" />
      <el-table-column label="حالة الطلب" align="center" prop="status">
        <template slot-scope="scope">
          <el-tag
            :type="getStatusTagType(scope.row.status)"
            disable-transitions
          >
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>

      
    <el-table-column label="الإجراءات" align="center" class-name="small-padding fixed-width">
      
      <template slot-scope="scope">
        
        <el-button
          size="mini"
          type="text"
          icon="el-icon-edit"
          @click.stop="handleUpdate(scope.row)"
          v-hasPermi="['api:advance:edit']"
        >تعديل</el-button>

        <el-button
          size="mini"
          type="text"
          icon="el-icon-delete"
          @click.stop="handleDelete(scope.row)"
          v-hasPermi="['api:advance:remove']"
        >حذف</el-button>

        <el-button
          size="mini"
          type="success"
          icon="el-icon-check"
          @click.stop="handleApprove(scope.row)"
          :disabled="scope.row.status != 0"
          v-hasPermi="['api:advance:edit']"
        >قبول</el-button>

        <el-button
          size="mini"
          type="danger"
          icon="el-icon-close"
          @click.stop="handleReject(scope.row)"
          :disabled="scope.row.status != 0"
          v-hasPermi="['api:advance:edit']"
        >رفض</el-button>
      </template>
</el-table-column>


    </el-table>

    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改طلبات السلف المالية对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item prop="empId" style="display: none;">
          <el-input v-model="form.empId" type="hidden" />
        </el-form-item>


        <el-form-item label="تاريخ تقديم الطلب" prop="requestDate">
          <el-date-picker
            clearable
            v-model="form.requestDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="اختر تاريخ تقديم الطلب">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="المبلغ المطلوب" prop="amount">
          <el-input v-model="form.amount" placeholder="أدخل المبلغ المطلوب" />
        </el-form-item>

        <el-form-item label="عدد الأشهر للتقسيط" prop="months">
          <el-input v-model="form.months" placeholder="أدخل عدد الأشهر للتقسيط" />
        </el-form-item>

        <el-form-item label="سبب الطلب" prop="reason">
          <el-input v-model="form.reason" type="textarea" placeholder="أدخل سبب الطلب" />
        </el-form-item>

        <!-- <el-form-item label="علامة الحذف (0: موجود، 2: محذوف)" prop="delFlag">
          <el-input v-model="form.delFlag" placeholder="أدخل علامة الحذف (0: موجود، 2: محذوف)" />
        </el-form-item> -->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">تأكيد</el-button>
        <el-button @click="cancel">إلغاء</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { listAdvance, getAdvance, delAdvance, addAdvance, updateAdvance } from "@/api/api/advance"
import { getEmp } from "@/api/api/emp"


export default {
  name: "Advance",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      employeeName: null,
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // طلبات السلف المالية表格数据
      advanceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        empId: null,
        requestDate: null,
        amount: null,
        months: null,
        reason: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        empId: [
          { required: true, message: "معرف الموظف مطلوب", trigger: "blur" }
        ],
        requestDate: [
          { required: true, message: "تاريخ تقديم الطلب مطلوب", trigger: "blur" }
        ],
        amount: [
          { required: true, message: "المبلغ المطلوب مطلوب", trigger: "blur" }
        ],
        months: [
          { required: true, message: "عدد الأشهر للتقسيط مطلوب", trigger: "blur" }
        ]
      }

    }
  },
  created() {
    this.getList()
    this.form.empId = this.$route.params.empId;
    this.loadEmployeeName(this.$route.params.empId);
  },
  activated() {
    this.getList()
    this.form.empId = this.$route.params.empId;
    this.loadEmployeeName(this.$route.params.empId);
  },
  methods: {
    /** 查询طلبات السلف المالية列表 */
    getList() {
      this.queryParams.empId = this.$route.params.empId
      this.loading = true
      listAdvance(this.queryParams).then(response => {
        this.advanceList = response.rows
        this.total = response.total
        this.loading = false
      })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        empId: null,
        requestDate: null,
        amount: null,
        months: null,
        reason: null,
        status: null,
        delFlag: null,
        createBy: null,
        createTime: null,
        updateBy: null,
        updateTime: null
      }
      this.resetForm("form")
    },
    async loadEmployeeName(empId) {
      try {
          const res = await getEmp(empId);
          this.employeeName = res.data.name || '';
        } catch (error) {
          this.employeeName = null
      }
    },
    goToInstallment(row) {
       if (row.status == '1') {
        this.$router.push({ path: "/hr/advance/installment/list/" + row.empId + "/" + row.id});
       }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm")
      this.handleQuery()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset()
      this.form.empId = this.$route.params.empId;
      this.open = true
      this.title = "اضافة سلفة"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset()
      this.form.empId = this.$route.params.empId; // or from selected row
      const id = row.id || this.ids
      getAdvance(id).then(response => {
        this.form = response.data
        this.open = true
        this.title = "تعديل سلفة"
      })
    },
    /** 提交按钮 */
    submitForm() {
      
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateAdvance(this.form).then(response => {
              this.$modal.msgSuccess("تم التعديل بنجاح")
              this.open = false
              this.getList()
            })
          } else {
            this.form.status = "1"
            addAdvance(this.form).then(response => {
              this.$modal.msgSuccess("تمت الإضافة بنجاح")
              this.open = false
              this.getList()
            })
          }
        }
      })
    },
    getStatusTagType(status) {
    switch (status) {
      case '0':
      case 0:
        return 'info';    // Blue
      case '1':
      case 1:
        return 'success'; // Green
      case '2':
      case 2:
        return 'danger';  // Red
      default:
        return 'warning'; // Fallback
    }
  },
  getStatusLabel(status) {
    switch (status) {
      case '0':
      case 0:
        return 'قيد الانتظار';
      case '1':
      case 1:
        return 'موافق عليه';
      case '2':
      case 2:
        return 'مرفوض';
      default:
        return 'غير معروف';
    }
  },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('هل أنت متأكد من حذف طلب السلفة المالية رقم "' + ids + '"؟').then(function() {
        return delAdvance(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("تم الحذف بنجاح");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('api/advance/export', {
        ...this.queryParams
      }, `advance_${new Date().getTime()}.xlsx`)
    },
    async handleApprove(row) {
      try {
        await this.$confirm('هل أنت متأكد من قبول هذا الطلب؟', 'تأكيد', {
          confirmButtonText: 'نعم',
          cancelButtonText: 'لا',
          type: 'warning'
        });

        const updated = { ...row, status: 1 }; // 1 = Approved
        await updateAdvance(updated); // reuse existing update function
        this.$message.success('تم قبول الطلب بنجاح');
        this.getList(); // refresh table
      } catch (err) {
        // canceled or failed
      }
},

async handleReject(row) {
  try {
    await this.$confirm('هل أنت متأكد من رفض هذا الطلب؟', 'تأكيد', {
      confirmButtonText: 'نعم',
      cancelButtonText: 'لا',
      type: 'warning'
    });

    const updated = { ...row, status: 2 }; // 2 = Rejected
    await updateAdvance(updated); // reuse existing update function
    this.$message.success('تم رفض الطلب');
    this.getList(); // refresh table
  } catch (err) {
    // canceled or failed
  }
},
  }
}
</script>
