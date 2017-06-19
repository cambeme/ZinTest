
import React from 'react';
import ReactDOM from 'react-dom';
import SearchableTable from './table';
const data = [
    { category: "Hàng thể thao", price: "$49.99", stocked: true, name: "Đá banh" },
    { category: "Hàng thể thao", price: "$9.99", stocked: true, name: "Bóng chày" },
    { category: "Hàng thể thao", price: "$29.99", stocked: false, name: "Bóng rổ" },
    { category: "Điện gia dụng", price: "$99.99", stocked: true, name: "iPod Touch" },
    { category: "Điện gia dụng", price: "$399.99", stocked: false, name: "iPhone 5" },
    { category: "Điện gia dụng", price: "$199.99", stocked: true, name: "Nexus 9" }
];

// Filterable CheatSheet Component
ReactDOM.render( <SearchableTable data={data}/>, document.getElementById('searchableTable') );