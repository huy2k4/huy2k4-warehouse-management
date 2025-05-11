// migrations/1_deploy_contracts.js

// Lay dinh nghia cua contract QuanLyKho tu thu muc contracts
const QuanLyKho = artifacts.require("QuanLyKho");

// Xuat ra mot ham de Truffle thuc thi viec deploy
module.exports = function (deployer) {
  // Lenh deploy contract QuanLyKho len blockchain
  deployer.deploy(QuanLyKho);
};  