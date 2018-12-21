var queue_list = [{id: 0, animationData: {mode: 0, c1: {r: 255, g: 129, b: 0}, c2: {r: 0, g: 0, b: 0}, t: 1025, p: 40, nr: 0, br: false}},{id: 1, animationData: {mode: 1, c1: {r: 255, g: 0, b: 0}, c2: {r: 0, g: 0, b: 255}, t: 1025, p: 20, nr: 0, br: false}}];
var temp_queue_list = [{mode: 0, c1: {r: 0, g: 0, b: 0}, c2: {r: 0, g: 0, b: 0}, t: 0, p: 0, nr: 0, br: false}];

exports.addAnimation = function(num_list,animationData){
  queue_list[num_list].push(animationData)
};

exports.getAnimation = function(num_list){
  return queue_list[num_list];
};

exports.clearAnimationList = function(num_list){
  queue_list[num_list] = [];
}

exports.shiftAnimationList = function(num_list){
  var animationData = queue_list[num_list][0];
  queue_list[num_list].shift();
  if(animationData.br)
    queue_list[num_list].push(animationData);
}

exports.bytesFromAnimationData = function(animationData){
  bytes = [];
  if (animationData.mode % 2 == 0){
    //jump or flash
    bytes[0] = 0x15;
  } else {
    //fade or pulse
    bytes[0] = 0x14;
  }
  for ( c of [animationData.c1, animationData.c2] )
  {
    bytes.push(c.r);
    bytes.push(c.g);
    bytes.push(c.b);
  }
  bytes.push(animationData.t >> 8);
  bytes.push(animationData.t-((animationData.t >> 8) << 8));
  bytes.push(animationData.p);
  bytes.push(animationData.nr);
  bytes.push(animationData.br*1);
  console.log(bytes)
}

this.bytesFromAnimationData(queue_list[0].animationData);
console.log(queue_list[0].animationData);
