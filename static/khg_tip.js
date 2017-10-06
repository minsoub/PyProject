	$("#tree_for_variable>li").not(':first').remove();
	$('#tree_for_variable').find('li.var').find('[value=Remove]').attr('disabled','disabled');
		$(cur_el_li).find('.ef').find('[value=Remove]').removeAttr('disabled');

		var is_ts=$(this).is(':checked');
		eq = (is_ts)?eq+'^t, t=1,2,\\cdots,10':eq;

		$(this).prop('checked', false);
		
function remove_var(btn){
	var cur=$(btn).closest('li.var').next('li');
	while ($(cur).length){
		var cur_id=parseInt($(cur).find('.id').eq(0).text());
		$(cur).find('.id').eq(0).text(cur_id-1);
		 cur=$(cur).next('li');		
	};
	$(btn).closest('li.var').remove();
}

$(btn).closest('.ef').clone().insertAfter(cur_ef_li);

var cur=$(this).closest('li.var');
var eq = (is_ts)?$(this).text()+'^t, t=1,2,\\cdots,10':$(this).text();
var math = MathJax.Hub.getAllJax($(cur)[0])[0];
$(cur)[0] 는 DOM element 자체를 나타냄. $(cur)는 jquery variable

.eq() returns it as a jQuery object, 
.get() return a raw DOM element.

menu=full_name.split('(');
inp.f_id=parseInt(menu[2].substring(0,menu[2].length-1));
var fruits = ["Banana", "Orange", "Apple", "Mango"];
var index = fruits.indexOf("Apple"); 
fruits.splice(index,1);

$(this).find('table tr').not(':first').not(':last').each(function(){
	return true;   // for continue와 같다.  return false는 for의 break와 같음
});

			
			
var faType;
if (capacityEmpty){
	faType='fa-plus-circle';
}else  faType='fa-minus-circle';
capacityLi.append('').html('<span class="bullet"><i class="fa ' +faType+ '" style="color:green"></i></span>'
if(investCostEmpty) $(investmentCostTableUl).hide();
capacityLi.append(investmentCostUl);

$(i_ul).html()	"<li class=\"t_i_li\"><span class=\"math\"> t=1:1x_{4}^{1} \\leq \\sum_{s=\\max\\{1,t-30+1\\}} y_{4}^s</span></li>"

