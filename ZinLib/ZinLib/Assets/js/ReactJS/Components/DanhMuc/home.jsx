import React from 'react';
import ReactDOM from 'react-dom';
import SearchableTable from './table.jsx';
import { Button } from 'react-bootstrap';
const data = [
    { category: "Hàng thể thao", price: "$49.99", stocked: true, name: "Đá banh" },
    { category: "Hàng thể thao", price: "$9.99", stocked: true, name: "Bóng chày" },
    { category: "Hàng thể thao", price: "$29.99", stocked: false, name: "Bóng rổ" },
    { category: "Điện gia dụng", price: "$99.99", stocked: true, name: "iPod Touch" },
    { category: "Điện gia dụng", price: "$399.99", stocked: false, name: "iPhone 5" },
    { category: "Điện gia dụng", price: "$199.99", stocked: true, name: "Nexus 9" }
];
var myComps = (
    <div>
        <SearchableTable data={data} />
        <Button bsStyle="primary">Xử lý</Button>
    </div>
);
ReactDOM.render(myComps, document.getElementById('searchableTable'));