var textOnPage = document.getElementById('showtext')
var sitResponse = {}
var dealResponse = {}
var turnHitResponse = {}
var standResponse = {}
var yourCards = document.querySelector('.your-cards')
var dealerCards = document.querySelector('.dealer-cards')
var betOptions = document.querySelector('.bet_button_container')
var playerTotal = 0;
var dealerTotal = 0;
var imagePath;
var increment = 0;
var betOpt;


function sit(number) {

    $.ajax({
        type: "POST",
        url: "https://blackjack.fuzz.me.uk/sit",
        data: {
            balance: number
        },
        success: function (res) {
            sitResponse = res;
            if (number >= 10 && number <= 1000) {

                for (let i = 0; i < sitResponse.availableBetOptions.length; i++) {
                    betOpt = sitResponse.availableBetOptions[i]
                    increment++
                    var buttonWrapper = document.createElement('div')
                    buttonWrapper.classList.add('button_wrap', 'animate__animated')
                    var createBetButton = document.createElement('button')
                    createBetButton.classList.add('bet_button' + increment)
                    buttonWrapper.appendChild(createBetButton)
                    // $('.button_wrap button').attr('onclick', deal(sitResponse.availableBetOptions[i]));
                    var buttonValue = document.createTextNode(String(sitResponse.availableBetOptions[i]))
                    createBetButton.appendChild(buttonValue)

                    betOptions.appendChild(buttonWrapper)
                    $('.bet_button' + increment).attr('onclick', 'deal(' + sitResponse.availableBetOptions[i] + ')')


                }
                $('.balance-container').removeClass('animate__bounceIn').addClass('animate__zoomOutRight')
                setTimeout(() => { $('.balance-container').addClass('hide') }, 500)
                setTimeout(() => {
                    $('.bet-container').show()
                }, 500);
            }
        },
        error: function (e, exception) {

            if (e.status == 400) {
                alert('"\"balance\" must be between 10 and 1000"')
            }


        }
    });



}


function deal(number) {
    $.ajax({
        type: "POST",
        url: "https://blackjack.fuzz.me.uk/deal",
        data: {
            "bet": number,
            "sessionId": sitResponse.sessionId
        },
        success: function (res) {
            dealResponse = res
            $('.your_balance').html('Your balance: ' + dealResponse.currentBalance)
            if (document.getElementById('balanceValue').value >= number) {

                setTimeout(() => {
                    $('.player_title').show()
                    $('.player_title').addClass('animate__animated').addClass('animate__bounceIn')
                }, 2500);
                for (let i = 0; i < dealResponse.playerCards.length; i++) {
                    setTimeout(() => {
                        var newCard = document.createElement("img");
                        var cardClass = String('my-image-player' + i)
                        newCard.classList.add(cardClass, 'card-class', 'animate__animated', 'animate__flipInY')
                        var newCardDiv = document.createElement('div')
                        newCardDiv.classList.add('card-wrap')
                        newCardDiv.appendChild(newCard)
                        yourCards.appendChild(newCardDiv);
                        imagePath = String('cards/' + dealResponse.playerCards[i].rank + '-' + dealResponse.playerCards[i].suite.charAt(0) + '.png');
                        $('.' + cardClass).attr("src", imagePath);
                        console.log('player', imagePath)
                    }, 1500);


                }
                setTimeout(() => {
                    $('.dealer_title').show()
                    $('.dealer_title').addClass('animate__animated').addClass('animate__bounceIn')
                }, 2500);
                for (let i = 0; i < dealResponse.dealerCards.length; i++) {
                    setTimeout(() => {
                        var newCard = document.createElement("img");
                        var cardClass = String('my-image-dealer' + i)
                        newCard.classList.add(cardClass, 'card-class', 'animate__animated', 'animate__flipInY')
                        var newCardDiv = document.createElement('div')
                        newCardDiv.classList.add('card-wrap')
                        newCardDiv.appendChild(newCard)
                        dealerCards.appendChild(newCardDiv);
                        imagePath = String('cards/' + dealResponse.dealerCards[i].rank + '-' + dealResponse.dealerCards[i].suite.charAt(0) + '.png');
                        $('.' + cardClass).attr("src", imagePath);
                        console.log('dealer', imagePath)
                    }, 1000);


                }


                if (dealResponse.roundEnded) {
                    $('.dealWinAmount').html(dealResponse.winAmount)
                    $('.dealCurrentBalance').html(dealResponse.currentBalance)
                    $('#showBalance').html(dealResponse.currentBalance)

                    if ($('.round_end_container').hasClass('animate__bounceOut')) {
                        $('.round_end_container').removeClass('animate__bounceOut')
                    }

                    if ($('.you_win').hasClass('animate__bounceOut')) {
                        $('.you_win').removeClass('animate__bounceOut')
                    }

                    if ($('.you_lost').hasClass('animate__bounceOut')) {
                        $('.you_lost').removeClass('animate__bounceOut')
                    }

                    if ($('.round-end').hasClass('hide')) {
                        $('.round-end').removeClass('hide')
                    }

                    if (dealResponse.winAmount < 0) {
                        $('.dealWinAmount').css('color', 'red');
                        $('.winner').html('YOU LOST')
                        setTimeout(() => {
                            $('.round_end_container').show();
                            $('.you_lost').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                            $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                            $('.money-container').show()
                        }, 300);

                    } else {
                        $('.dealWinAmount').css('color', 'green');
                        $('.winner').html('YOU WON')
                        setTimeout(() => {
                            $('.round_end_container').show();
                            $('.you_win').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                            $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                            $('.money-container').show()
                        }, 300);
                    }
                }

                $('.bet-container').removeClass('animate__bounceIn').addClass('animate__zoomOutRight')

                setTimeout(() => {

                    $('.bet-container').addClass('hide')
                    $('.cards-container').removeClass('animate__bounceOut').show()
                }, 500)
                setTimeout(() => {
                    $('.move-container').show().addClass('animate__animated').addClass('animate__bounceIn')

                }, 3000);

                $('#showbettext').addClass('hide')
            }


        },
        error: function (e, exception) {

            if (e.status == 500) {
                alert("\"bet\" must be lower than or equal to your balance")
                $('#showbettext').html('Your balance is: ' + document.getElementById('balanceValue').value)
                $('.bet-container').addClass('hide')
                $('.balance-container').removeClass('hide').removeClass('animate__zoomOutRight').addClass('animate__bounceIn')
                $('.bet_button_container').empty();
                $('.cards-container').addClass('hide')

            }
        }
    });

    $('.cards-container').removeClass('hide')



}


function turn(move) {
    if ((move == 'double' && dealResponse.currentBalance >= betOpt * 2) || (move == 'hit') || (move == 'stay')) {
        $.ajax({
            type: "POST",
            url: "https://blackjack.fuzz.me.uk/turn",
            data: {
                "action": move,
                "sessionId": sitResponse.sessionId
            },
            success: function (res) {

                if (move == 'hit') {
                    increment++;
                    turnHitResponse = res
                    var newCard = document.createElement("img");
                    newCard.classList.add('my-image-hit' + increment, 'card-class', 'animate__animated', 'animate__flipInY')
                    var newCardDiv = document.createElement('div')
                    newCardDiv.classList.add('card-wrap')
                    newCardDiv.appendChild(newCard)
                    yourCards.appendChild(newCardDiv);
                    imagePath = String('cards/' + turnHitResponse.playerCard.rank + '-' + turnHitResponse.playerCard.suite.charAt(0) + '.png');
                    $('.my-image-hit' + increment).attr("src", imagePath);
                    console.log('player', imagePath)
                    if (turnHitResponse.roundEnded) {
                        $('.dealWinAmount').html(turnHitResponse.winAmount)
                        $('.dealCurrentBalance').html(turnHitResponse.currentBalance)
                        $('#showBalance').html(turnHitResponse.currentBalance)
                        if ($('.round_end_container').hasClass('animate__bounceOut')) {
                            $('.round_end_container').removeClass('animate__bounceOut')
                        }
                        if ($('.round-end').hasClass('hide')) {
                            $('.round-end').removeClass('hide')
                        }

                        if ($('.you_win').hasClass('animate__bounceOut')) {
                            $('.you_win').removeClass('animate__bounceOut')
                        }

                        if ($('.you_lost').hasClass('animate__bounceOut')) {
                            $('.you_lost').removeClass('animate__bounceOut')
                        }
                        if (turnHitResponse.winAmount < 0) {
                            $('.winner').html('YOU LOST')
                            $('.dealWinAmount').css('color', 'red');
                            setTimeout(() => {
                                $('.round_end_container').show();
                                $('.you_lost').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.money-container').show()
                            }, 300);

                        } else {
                            $('.dealWinAmount').css('color', 'green');
                            $('.winner').html('YOU WON')
                            setTimeout(() => {
                                $('.round_end_container').show();
                                $('.you_win').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.money-container').show()
                            }, 300);
                        }

                        if ($('.round_end_container').hasClass('hide')) {
                            $('.round_end_container').removeClass('hide')
                        }
                    }

                } else if (move == 'stay') {
                    turnHitResponse = res
                    $('.my-image-dealer0').addClass('hide')
                    for (let i = 0; i < turnHitResponse.dealerCards.length; i++) {
                        var newCard = document.createElement("img");
                        var cardClass = String('my-image-stay' + i)
                        newCard.classList.add(cardClass, 'card-class', 'animate__animated', 'animate__flipInY')
                        var newCardDiv = document.createElement('div')
                        newCardDiv.classList.add('card-wrap')
                        newCardDiv.appendChild(newCard)
                        dealerCards.appendChild(newCardDiv);
                        imagePath = String('cards/' + turnHitResponse.dealerCards[i].rank + '-' + turnHitResponse.dealerCards[i].suite.charAt(0) + '.png');
                        $('.' + cardClass).attr("src", imagePath);
                        console.log('dealer', imagePath)
                    }

                    if (turnHitResponse.roundEnded) {
                        $('.dealWinAmount').html(turnHitResponse.winAmount)
                        $('.dealCurrentBalance').html(turnHitResponse.currentBalance)
                        $('#showBalance').html(turnHitResponse.currentBalance)
                        if ($('.round_end_container').hasClass('animate__bounceOut')) {
                            $('.round_end_container').removeClass('animate__bounceOut')
                        }
                        if ($('.round-end').hasClass('hide')) {
                            $('.round-end').removeClass('hide')
                        }

                        if ($('.you_win').hasClass('animate__bounceOut')) {
                            $('.you_win').removeClass('animate__bounceOut')
                        }

                        if ($('.you_lost').hasClass('animate__bounceOut')) {
                            $('.you_lost').removeClass('animate__bounceOut')
                        }
                        if (turnHitResponse.winAmount < 0) {
                            $('.winner').html('YOU LOST')
                            $('.dealWinAmount').css('color', 'red');
                            setTimeout(() => {
                                $('.round_end_container').show();
                                $('.you_lost').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.money-container').show()
                            }, 300);

                        } else {
                            $('.winner').html('YOU WON')
                            $('.dealWinAmount').css('color', 'green');
                            setTimeout(() => {
                                $('.round_end_container').show();
                                $('.you_win').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.money-container').show()
                            }, 300);
                        }

                        if ($('.round_end_container').hasClass('hide')) {
                            $('.round_end_container').removeClass('hide')
                        }
                    }
                } else if (move == 'double') {
                    turnHitResponse = res
                    // if (dealResponse.currentBalance >= betOpt * 2) {
                    increment++;
                    var newCard = document.createElement("img");
                    newCard.classList.add('my-image-double' + increment, 'card-class', 'animate__animated', 'animate__flipInY')
                    var newCardDiv = document.createElement('div')
                    newCardDiv.classList.add('card-wrap')
                    newCardDiv.appendChild(newCard)
                    yourCards.appendChild(newCardDiv);
                    imagePath = String('cards/' + turnHitResponse.playerCard.rank + '-' + turnHitResponse.playerCard.suite.charAt(0) + '.png');
                    $('.my-image-double' + increment).attr("src", imagePath);
                    console.log('dealer', imagePath)
                    if (turnHitResponse.roundEnded) {
                        $('.dealWinAmount').html(turnHitResponse.winAmount)
                        $('.dealCurrentBalance').html(turnHitResponse.currentBalance)
                        $('#showBalance').html(turnHitResponse.currentBalance)
                        if ($('.round_end_container').hasClass('animate__bounceOut')) {
                            $('.round_end_container').removeClass('animate__bounceOut')
                        }
                        if ($('.round-end').hasClass('hide')) {
                            $('.round-end').removeClass('hide')
                        }

                        if ($('.you_win').hasClass('animate__bounceOut')) {
                            $('.you_win').removeClass('animate__bounceOut')
                        }

                        if ($('.you_lost').hasClass('animate__bounceOut')) {
                            $('.you_lost').removeClass('animate__bounceOut')
                        }
                        if (turnHitResponse.winAmount < 0) {
                            $('.winner').html('YOU LOST')
                            $('.dealWinAmount').css('color', 'red');
                            setTimeout(() => {
                                $('.round_end_container').show();
                                $('.you_lost').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.money-container').show()
                            }, 300);

                        } else {
                            $('.winner').html('YOU WON')
                            $('.dealWinAmount').css('color', 'green');
                            setTimeout(() => {
                                $('.round_end_container').show();
                                $('.you_win').removeClass('hide').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.round_end_container').addClass('animate__animated').addClass('animate__bounceIn');
                                $('.money-container').show()
                            }, 300);
                        }
                        if ($('.round_end_container').hasClass('hide')) {
                            $('.round_end_container').removeClass('hide')
                        }

                    }


                }


            },
            error: function (e, exception) {
                console.log(move)

                if (e.status == 400) {
                    textOnPage.innerHTML = "\"action\" must be one of [hit, stay, double]"
                }
            }
        });
    } else {
        $('.your_balance').html('Your balance is ' + dealResponse.currentBalance + '. It is too low to double. Please select hit or stay')
        $('#double').hide()
    }

}

function stand() {
    $.ajax({
        type: "POST",
        url: "https://blackjack.fuzz.me.uk/stand",
        data: {
            "sessionId": sitResponse.sessionId
        },
        success: function (res) {
            standResponse = res;
            if (standResponse.winAmount < 0) {
                $('.dealWinAmount').html('Your total loss: ' + standResponse.winAmount)
                $('.winner').css('visibility', 'hidden')
                $('.dealWinAmount').css('color', 'red');
            } else {
                $('.dealWinAmount').html('Your total win: ' + standResponse.winAmount)
                $('.winner').css('visibility', 'hidden')
                $('.dealWinAmount').css('color', 'green');
            }

            $('.rounds-played').html(standResponse.roundsPlayed)
            $('.rounds-number').show()

            if ($('.rounds-number p').hasClass('hide')) {
                $('.rounds-number p').removeClass('hide')
            }

            $('.round-end').addClass('hide')
            $('#double').show()
        },
        error: function (e, exception) {

            if (e.status == 400) {
                textOnPage.innerHTML = "\"balance\" must be less than or equal to 1000"
            }
        }
    });



}

function newDeal() {

    // $('.dealWinAmount').html('0')

    if ($('.you_lost').hasClass('hide')) {
        $('.you_win').removeClass('animate__bounceIn').addClass('animate__bounceOut')
        $('.round_end_container').removeClass('animate__bounceIn').addClass('animate__bounceOut');
        $('.cards-container').addClass('hide')
        setTimeout(() => {

            $('.you_win').addClass('hide');
            $('.cards-container').removeClass('animate__bounceIn').addClass('animate__bounceOut')
            $('.cards-container').removeClass('animate__bounceOut')

            $('.card-class').hide();
            $('.bet-container').removeClass('animate__zoomOutRight').removeClass('hide').addClass('animate__bounceIn')
            $('.card-wrap').hide()
            $('.round_end_container').hide()
        }, 1000);
    } else if ($('.you_win').hasClass('hide')) {
        $('.you_lost').removeClass('animate__bounceIn').addClass('animate__bounceOut')
        $('.round_end_container').removeClass('animate__bounceIn').addClass('animate__bounceOut');
        $('.cards-container').addClass('hide')
        setTimeout(() => {
            $('.you_lost').addClass('hide');
            $('.cards-container').removeClass('animate__bounceIn').addClass('animate__bounceOut')
            $('.cards-container').removeClass('animate__bounceOut')
            $('.cards-container').addClass('hide')

            $('.card-class').hide();
            $('.bet-container').removeClass('animate__zoomOutRight').removeClass('hide').addClass('animate__bounceIn')

            $('.round_end_container').hide()
        }, 1000);
    }
    $('.dealer-cards').empty()
    $('.your-cards').empty()
    $('#double').show()
}

$('.balance-container').hide();
$('#sitButton').click(() => {
    if ($('.balance-container').hasClass('hide')) {
        $('.balance-container').removeClass('hide').removeClass('animate__zoomOutRight').addClass('animate__bounceIn')
        $('.round_end_container').addClass('hide')
        $('.you_win').removeClass('animate__bounceIn').addClass('hide')
        $('.you_lost').removeClass('animate__bounceIn').addClass('hide')
        $('.card-class').addClass('hide');
        $('.dealer-cards').empty()
        $('.your-cards').empty()
        $('.round_end_container').removeClass('animate__bounceIn')
    }
    $('.sitbutton').removeClass('animate__bounceIn').addClass('animate__zoomOutRight')
    setTimeout(() => { $('.sitbutton').addClass('hide') }, 500)
    setTimeout(() => {
        $('.balance-container').show()
        if (document.getElementById('balanceValue').value > 9 && document.getElementById('balanceValue').value < 1001) {
            $('#showBalance').html(document.getElementById('balanceValue').value)
        }
    }, 500);
});

$('#addMoney').click(() => {
    if ($('.bet-container').hasClass('hide')) {
        $('.bet-container').removeClass('hide').removeClass('animate__zoomOutRight').addClass('animate__bounceIn')

    }
});
$('.bet-container').hide()
$('.money-container').hide()
$('.move-container').hide()
$('.cards-container').hide()
$('.round_end_container').hide()
$('.rounds-number').hide()
$('.player_title').hide()
$('.dealer_title').hide()

$('#playAgain').click(() => {
    setTimeout((() => {
        $('.sitbutton').removeClass('animate__zoomOutRight').removeClass('hide')
        $('.round_end_container').removeClass('animate__bounceIn').removeClass('hide').addClass('animate__bounceOut')
        $('.rounds-number p').addClass('hide')
        // $('.bet_button_container').empty();
        $('.you_win').addClass('hide')
        $('.you_lost').addClass('hide')
        $('.cards-container').addClass('hide')
        $('.bet_button_container').empty();
    }), 300);

});



