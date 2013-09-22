var resetSession = function(room) {
  if(Session.equals('room', room)) {
    Session.set('enemy', null);
    Session.set('room', null);
    Session.set('weapon', GameLogic.X);
    $('.gameboard').html(Meteor.render(Template.game));
  }
}

var checkGameOver = function(user, status) {
  if(status) {
    if(status === GameLogic.D) {
      alert('Empate!');
    } else {
      if(status === Session.get('weapon'))
        GameStream.emit('winner',user);
      alert('Vencedor: ' + user);
    }
    GameStream.emit('endgame', Session.get('room'));
  }
}

GameStream.on('request', function(user, enemy, room) {
  if(Session.equals('user', user)) {
    if(confirm('Deseja jogar com '+ enemy +'?')) {
      Session.set('enemy', enemy);
      Session.set('weapon', GameLogic.O);
      Session.set('room', room);
      Session.set('play', false);
      GameStream.emit('start', room, GameLogic.X);
    } else {
      GameStream.emit('cancel', room);
    }
  }
});

GameStream.on('end', function(room) {
  resetSession(room);
});

GameStream.on('abort', function(room) {
  alert('Jogo cancelado.');
  resetSession(room);
});

GameStream.on('play', function(room, weapon) {
  if(Session.equals('room', room) && Session.equals('weapon', weapon)) {
    Session.set('play', true);
  }
});

GameStream.on('refresh', function(room, user, weapon, row, col, status) {
  if(Session.equals('room', room)) {
    var board = $('.gameboard');
    var target = board.find('.row[data-row="'+ row +'"]');
    target = target.find('.col[data-col="'+ col +'"]');
    target.html('<i class="'+ weapon +'"></i>');
    checkGameOver(user, status);
    if(!Session.equals('weapon', weapon)) {
      Session.set('play', true); 
    }
  }
});