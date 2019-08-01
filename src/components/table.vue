<template>
  <div v-cloak class="container">
    <div v-if="loading">Waiting for data...</div>
    <div v-else class="table">
      <message v-if="added" text="New item added to database" color="rgb(64, 175, 113)"></message>
      <message v-if="updated" text="Item updated" color="rgb(253,205,133)"></message>
      <message v-if="deleted" text="Item deleted from database" color="rgb(253,143,133)"></message>
      <message v-if="serverError" text="Error while connecting to database. Try again later."
               color="red"></message>
      <div class="table__search">
        <search @input="input"></search>
      </div>
      <div class="table__btn-block">
        <button @click="openPopup" class="button">Add new data</button>
      </div>

      <div v-if="showPopup" class="popup">
        <form ref="mainForm">
          <div class="popup__btn-close" @click="closePopup">
            <img src="../assets/close.svg" alt="Close" class="popup__icon">
          </div>
          <p class="popup__title">Add new element</p>
          <div class="popup__form">
            <div class="popup__field">
              <input type="name" v-model="newName" class="popup__input"
                     v-validate="'required|alpha_spaces'" name="name"
                     data-vv-validate-on="blur">
              <label class="popup__label" :class="{'top' : newName != ''}">Name</label>
              <p class="error" v-if="errors.has('name')">{{errors.first('name')}}</p>
            </div>

            <div class="popup__field">
              <input type="text" v-model="newLocation" class="popup__input"
                     v-validate="'required|alpha_spaces'" name="location"
                     data-vv-validate-on="blur">
              <label class="popup__label" :class="{'top' : newLocation != ''}">Location</label>
              <p class="error" v-if="errors.has('location')">{{errors.first('location')}}</p>
            </div>

            <div class="popup__field">
              <input min="1" type="number" v-model="newCurrency" pattern="[0-9.]"
                     class="popup__input" v-validate="'required|numeric'" name="currency"
                     data-vv-validate-on="blur">
              <label class="popup__label" :class="{'top' : newCurrency != ''}">Currency</label>
              <p class="error" v-if="errors.has('currency')">
                {{errors.first('currency')}} Only numbers are allowed.
              </p>
            </div>

            <button @click.prevent="addItem" class="button">Add</button>
          </div>
        </form>
      </div>

      <div class="table__data">
        <div class="table__head row">
          <div class="table__title" style="cursor: pointer" @click="sort('name')">Name</div>
          <div class="table__title"  style="cursor: pointer" @click="sort('location')">Location</div>
          <div class="table__title"  style="cursor: pointer" @click="sort('currency')">Currency</div>
          <div class="table__title"  style="cursor: pointer">Actions</div>
        </div>
        <div class="table__body">
          <div v-for="(item, idx) in sortedData" :key="idx" class="row">
            <div class="table__item">
              <p  ref="editable"
                  :contenteditable="!item.disabled"
                  @blur="updateElement($event, 'name')"
                  @keypress="restrictChars($event, 'name')"
                  @keydown.enter.prevent
                  :disabled="item.disabled"
                  class="table__input"
                  :class="{'disabled' : item.disabled}"
              >
                {{item.name}}
              </p>
            </div>
            <div class="table__item">
              <p  ref="editable"
                  :contenteditable="!item.disabled"
                  @blur="updateElement($event, 'location')"
                  @keypress="restrictChars($event, 'location')"
                  @keydown.enter.prevent
                  :disabled="item.disabled"
                  class="table__input"
                  :class="{'disabled' : item.disabled}"
              >
                {{item.location}}
              </p>

            </div>
            <div class="table__item">
              <p  ref="editable"
                  :contenteditable="!item.disabled"
                  @input="updateElement($event, 'currency')"
                  @keypress="restrictChars($event, 'currency')"
                  @keydown.enter.prevent
                  :disabled="item.disabled"
                  class="table__input"
                  :class="{'disabled' : item.disabled}"
              >
                {{item.currency}}
              </p>
            </div>
            <div class="table__item">
              <div class="table__buttons">
                <div class="table__button" @click="showDetails(item)">
                  <div class="table__image">
                    <img src="../assets/caret-right.svg" alt="Lok for Details" class="table__icon">
                  </div>
                  <span>Details</span>
                </div>

                <div class="table__button" @click="editItem(item, true)" v-if="!item.disabled">
                  <div class="table__image">
                    <img src="../assets/floppy-o.svg" alt="Edit" class="table__icon">
                  </div>
                  <span>Save</span>
                </div>

                <div class="table__button" @click="editItem(item)" v-else>
                  <div class="table__image">
                    <img src="../assets/edit.svg" alt="Edit" class="table__icon">
                  </div>
                  <span>Edit</span>
                </div>

                <div class="table__button" @click="deleteItem(item.doc_id)">
                  <div class="table__image">
                    <img src="../assets/trash-o.svg" alt="Delete" class="table__icon">
                  </div>
                  <span>Delete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="total">
        <p class="total__title">Total sum</p>
        <p class="total__sum">{{totalSum}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import store from '../store/store';
import search from './search';
import message from './message';
import { getDataFromDB, addDataToDB, updateDataToDB, deleteDataFromDB } from '../firebase/firebase.utils';

const uuid = require('uuid-v4');

export default {
  name: 'Table',
  data (){
    return {
      newName: '',
      newLocation: '',
      newCurrency: '',
      tableData: null,
      name: '',
      location: '',
      currency: 0,
      sortBy: 'name',
      sortDir: 'asc',
      search: '',
      loading: true,
      showPopup: false,
      added: false,
      updated: false,
      deleted: false,
      serverError: false
    }
  },

  components: {
    search,
    message
  },

  mounted(){
    this.getData();
  },

  computed:{
    sortedData() {
      if(this.tableData) {
        if(this.search){
          let sorted = this.getSortedData();
          return sorted.filter(item => {
            return this.inSearch(item.name) ||
                   this.inSearch(item.location) ||
                   this.inSearch(item.currency.toString())
          });
        }
        return this.getSortedData();
      }
    },

    totalSum(){
      if(this.countTotal()) {
        return this.tableData.reduce((acc, item) => {
          return acc + item.currency;
        }, 0);
      }
    }
  },

  methods: {
    inSearch(field){
      return field.toLowerCase().includes(this.search.toLowerCase());
    },

    countTotal() {
      return !this.loading
             && this.tableData !== null
             && this.tableData.length > 0
    },

    isCurrency(fieldName){
      return fieldName === "currency";
    },

    showDetails(item){
      this.$router.push({name: 'details', params: {id: item.id, details: item }});
    },

    getSortedData(){
      return this.tableData.sort((a,b) => {
        const asc = 1;
        const desc = -1;
        let modifier = this.sortDir === 'desc' ? desc : asc;

        if(this.isCurrency(this.sortBy)){
          return a[this.sortBy] < b[this.sortBy]
                  ? desc * modifier
                  : asc * modifier;
        } else {
          return (a[this.sortBy]).toLowerCase() < (b[this.sortBy]).toLowerCase()
                  ? desc * modifier
                  : asc * modifier;
        }
      });
    },

    deleteItem(doc_id){
      deleteDataFromDB(doc_id)
        .then(() => {
          this.deleted = true;
          this.getData();
          setTimeout(() => {
            this.deleted = false;
          }, 6000);
        })
        .catch(() => {
          this.serverError = true;
          setTimeout(() => {
            this.serverError = false;
          }, 6000);
        });
    },

    restrictChars(e, fieldName){
      const onlyDigitsPattern = /\d/;
      const onlyLettersPattern = /\D/;

      if(this.isCurrency(fieldName)){
        if (!onlyDigitsPattern.test(String.fromCharCode(e.charCode))) {
          e.preventDefault();
        }
      } else {
        if (!onlyLettersPattern.test(String.fromCharCode(e.charCode))) {
          e.preventDefault();
        }
      }
    },

    updateElement(e, fieldName){
      if(this.isCurrency(fieldName)){
        this[fieldName] = parseInt(e.target.innerText);
      } else {
        this[fieldName] = e.target.innerText;
      }
    },

    openPopup(){
      this.showPopup = true;
    },

    closePopup(){
      this.showPopup = false;
      this.newName = '';
      this.newLocation = '';
      this.newCurrency = 0;
    },

    cleanRow(){
      this.name = '';
      this.location = '';
      this.currency = 0;
    },

    addItem(){
      this.$validator.validate().then((valid) => {
        if(valid){
          const newItem = {
            "name": this.newName,
            "location": this.newLocation,
            "currency": parseInt(this.newCurrency),
            "id": uuid()
          };

          addDataToDB(newItem)
            .then(() => {
              this.closePopup();
              this.getData();
              this.added = true;
              setTimeout(() => {
                this.added = false;
              }, 6000);
            })
            .catch(() => {
              this.serverError = true;
              setTimeout(() => {
                this.serverError = false;
              }, 6000);
            });
        }
      });
    },

    updateItem(item, newItem){
      updateDataToDB(item.doc_id, newItem)
        .then(() => {
          this.getData();
          this.cleanRow();
          item.disabled = true;
          this.updated = true;
          setTimeout(() => {
            this.updated = false;
          }, 6000)
        })
        .catch(() => {
          this.serverError = true;
          setTimeout(() => {
            this.serverError = false;
          }, 6000);
        });
    },

    getData(){
      getDataFromDB()
        .then(resp => {
          store.dispatch('getDataFromDB', resp);
          this.tableData = store.state.tableData;
          this.tableData.forEach(item => {
            this.$set(item, 'disabled', true);
          });
          this.loading = false;
        })
        .catch(() => {
          this.serverError = true;
          setTimeout(() => {
            this.serverError = false;
          }, 6000);
        });
    },

    editItem(item, save = false){
      item.disabled = false;
      if(save){
        let updatedItem = {};
        if(this.name !== ''){
          Object.assign(updatedItem, {"name": this.name});
        }
        if(this.location !== ''){
          Object.assign(updatedItem, {"location": this.location});
        }
        if(this.currency !== 0){
          Object.assign(updatedItem, {"currency": this.currency});
        }
        if(Object.keys(updatedItem).length === 0){
          item.disabled = true;
        } else {
          this.updateItem(item, updatedItem);
        }
      }
    },

    sort(sortKey){
      if(sortKey === this.sortBy) {
        this.sortDir = this.sortDir==='asc'?'desc':'asc';
      }
      this.sortBy = sortKey;
    },

    input(search){
      this.search = search;
    }
  }
};
</script>

<style scoped lang="stylus">
  .is-invalid {
    border 1px solid red

    &:focus {
      border none
    }
  }

  .container {
    width 100%
    max-width 900px
    padding 50px 70px
    margin 50px auto
    box-shadow 0 2px 19px 0 rgba(4, 10, 38, 0.2)
  }

  .table {
    &__head {
      border-bottom 2px solid #000
    }
    &__title {
      width 25%
      text-align center
      padding 10px 0
    }
    &__item {
      width 25%
    }
    &__buttons {
      display flex
      justify-content space-between
      padding 7px 10px
    }
    &__button {
      display flex
      align-items center
      font-size 13px
      cursor pointer
      transition .2s

      &:hover {
        transform scale(1.1)
      }
    }
    &__icon {
      width 100%
      height 20px
    }
    &__image {
      width 15px
      height 20px
      margin-right 5px
    }
    &__btn-block {
      margin-bottom 30px
      display flex
      justify-content flex-end
    }
    &__search {
      width 100%
      margin-bottom 40px
    }
    &__input {
      height auto
      padding 10px
      border none
      outline none

      &.disabled {
        background-color #f5f5f5
        color #595959
      }
    }
  }

  .total {
    display flex
    justify-content space-between
    margin-top 20px
    width 100%
    max-width 75%
    font-size 20px
    font-weight bold
  }

  .popup {
    width 100%
    max-width 300px
    position absolute
    z-index 5
    box-shadow 0 2px 19px 0 rgba(4, 10, 38, 0.2)
    border-radius 3px
    background-color #fff
    left 50%
    transform translateX(-50%)
    top 20%
    padding 20px

    &__title {
      font-size 24px
      font-weight bold
      margin-bottom 30px
      text-align center
    }

    &__input {
      width 100%
      padding 10px 0
      text-indent 10px

      &:focus ~ .popup__label {
        top: -20px;
        left 0
        font-size: 14px;
      }
    }

    &__label.top {
      top: -20px;
      left 0
      font-size: 14px;
    }

    &__field {
      position relative
      margin-bottom 40px
    }

    &__label {
      font-size 15px
      position: absolute;
      pointer-events: none;
      left: 10px;
      top: 10px
      transition: 300ms ease all;
    }

    &__btn-close {
      width 15px
      position absolute
      top 10px
      right 10px
      cursor pointer
    }

    &__icon {
      width 100%
    }
  }

  .row {
    display flex
    justify-content space-between
  }

  .error {
    margin 10px 0 0 0
    color red
    font-size 13px
  }

  .button {
    width 100%
    max-width 300px
    height 40px
    background-color rgb(26,26,230)
    color #ffffff
    font-weight bold
    font-size 15px
    border none
    outline none
    cursor pointer

    &:hover {
      background-color rgb(56,56,255)
    }
  }
</style>
