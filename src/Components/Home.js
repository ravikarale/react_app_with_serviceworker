import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "../assets/css/header.scss";
import "../assets/css/home.scss";
import { get, post } from "./../utils/API";
import * as serviceWorker from './../serviceWorker';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      name: "",
      price: ""
    };
  }

  async componentDidMount() {
    try {
      const { data } = await get(`orders`);
      console.log("dataaa", data.data)
      var orders = data.data
      this.setState({ orders: orders });
    } catch (e) {
    }
  }

  saveOrder = async () => {
    var orderData = {
      name: this.state.name,
      price: this.state.price
    }
    if(!navigator.onLine){
      serviceWorker.registerSync();
      this.insertIntoDatabase(JSON.stringify(orderData));
      console.log([...this.state.orders, orderData])
      this.setState({ orders: [...this.state.orders, orderData], name: "", price: "" });
    }else{
      try {
        const { data } = await post(orderData, `orders`);
        var order = data;
        this.setState({ orders: [...this.state.orders, order.data], name: "", price: "" });
      } catch (e) {
      }
    }
  }


  insertIntoDatabase =  (dataObject) =>  {
    var indexedDBOpenRequest = window.indexedDB.open('order',  1)
    indexedDBOpenRequest.onupgradeneeded = function () {
        this.result.createObjectStore('order_requests', {
        autoIncrement:  true })
    }

    indexedDBOpenRequest.onsuccess = function () {
        let db = this.result
        let transaction = db.transaction("order_requests", "readwrite");
        let storeObj = transaction.objectStore("order_requests");
        storeObj.add(dataObject);
    }
    indexedDBOpenRequest.onerror = function (error) {
        console.error('IndexedDB error:', error)
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    return (
      <>
        <div className="main-container">
        
          <div>
            <div className="col-md-5">
              <div className="form-group">
              <label>Order Name</label>
              <input
                  type="text"
                  name="name"
                  value={this.state.name}
                  onChange={this.handleInputChange}
                  placeholder="Order Name"
                  className="form-control"
                />
            </div>
              <div className="form-group">
              <label>Order Price</label>
              <input
                  type="text"
                  name="price"
                  value={this.state.price}
                  onChange={this.handleInputChange}
                  placeholder="Order price"
                  className="form-control"
                />
            </div>
            </div>
            <div className="col-md-8" style={{ textAlign: 'center'}}>
              <button onClick={this.saveOrder}>Save</button>
            </div>
          </div>


          <table className="table table-striped">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
            {this.state.orders.map((order, idx) => {
              return (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{order.name}</td>
                  <td>{order.price}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </>
    );
  }
}
export default withRouter(Home);
