var queue_list = [[{mode: 0, data:[0,0,0,0,0,00,0,0, 0, 0]}]]
var temp_queue_list = [[{mode: 0, data:[0,0,0,0,0,00,0,0, 0, 0]}]]

exports.addAnimation = function(num_list,mode,data){
  queue_list[num_list].push({"mode":mode, "data":data})
};

exports.getAnimationList = function(num_list){
  return queue_list[num_list];
};

exports.clearAnimationList = function(num_list){
  queue_list[num_list] = [];
}

exports.shiftAnimationList = function(num_list){
  var el = queue_list[num_list][0];
  queue_list[num_list].shift();
  if(el.data[el.data.length - 1])
    queue_list[num_list].push(el);
}