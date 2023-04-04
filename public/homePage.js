"use strict";

const logoutButton = new LogoutButton(); // Выход из личного кабинета

logoutButton.action = function() {
    ApiConnector.logout(response => {
        if (response.success) {
            location.reload();
        }
    })
}

ApiConnector.current(response => {
    if (response.success) {
        ProfileWidget.showProfile(response.data)
    }
})



const ratesBoard = new RatesBoard(); // Получение текущих курсов валюты

function getRates() {
    ApiConnector.getStocks(response => {
        if (response.success) {
            ratesBoard.clearTable(response.data);
            ratesBoard.fillTable(response.data);
        }
    })
}

getRates();
setInterval(getRates,60000);



const moneyManager = new MoneyManager(); // Операции с деньгами

moneyManager.addMoneyCallback = function(data) { // пополнение баланса
    ApiConnector.addMoney (data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(response, "Успешное пополнение баланса");
        } else {
            this.setMessage(false, response.error);
        }
    })
}

moneyManager.conversionMoneyCallback = function(data) { // конвертирование валюты
    ApiConnector.convertMoney (data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(response, "Успешная конвертация валюты");
        } else {
            this.setMessage(false, response.error);
        }
    })
}

moneyManager.sendMoneyCallback = function(data) { // перевод валюты
    ApiConnector.transferMoney (data, response => {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            this.setMessage(response, "Успешный перевод");
        } else {
            this.setMessage(false, response.error);
        }
    })
}



const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites(response => { // начальный список избранного
    if (response.success)
        favoritesWidget.clearTable(response.data);
        favoritesWidget.fillTable(response.data);
        moneyManager.updateUsersList(response.data);
})

favoritesWidget.addUserCallback = function(data) { // добавление пользователя в список избранных
    ApiConnector.addUserToFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable(response.data);
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response, "Успешное добавление пользователя в избранное");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    })   
}

favoritesWidget.removeUserCallback = function(data) { // удаление пользователя из избранного
    ApiConnector.removeUserFromFavorites(data, response => {
        if (response.success) {
            favoritesWidget.clearTable(response.data);
            favoritesWidget.fillTable(response.data);
            moneyManager.updateUsersList(response.data);
            favoritesWidget.setMessage(response, "Успешное удаление пользователя из избранного");
        } else {
            favoritesWidget.setMessage(false, response.error);
        }
    })   
}



