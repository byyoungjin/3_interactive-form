//Focus on First input box when page has loaded
$(document).ready(()=>{
  $('#name').focus();
  $('#other-title').hide();
});

//If Job Role === 'other' -> show #other-title input field
$('#title').change((e)=>{
  const jobRole = e.target.value;
  if(jobRole==="other"){
    $('#other-title').show();
  } else {
    $('#other-title').hide();
  }
});

//Make only Design available color to be shown
$('#design').change((e)=>{
  const color = $('#color')[0];
  //Function for color Select
  function colorSelect(colorList){
    let j = 1 ;
    for(let i =0; i<color.length; i++){
      if(colorList.indexOf(color.options[i].text)>-1){
        color.options[i].style.display = 'block';
        //Initialize the First index color to be shown
        while(j>0){
          color.options[i].selected = 'selected';
          j--;
        }

      } else{
        color.options[i].style.display = 'none';
      }
    }
  }
  if(e.target.value === 'js puns'){
    let colorList = 'Cornflower Blue, Dark Slate Grey, Gold';
    colorSelect(colorList);
  } else if(e.target.value ==='heart js'){
    let colorList = 'Tomato, Steel Blue, Dim Grey';
    colorSelect(colorList);
  }
  $('#colors-js-puns').show();
});


//activities part
//Function that get the data(day, time, money) from text Contents
function getData(data,string){
  if(data === 'day'){
    return string.replace(/.*\s(.*)day(.*)/,"$1");
  }else if(data ==='time'){
    return string.replace(/.*\s(\d*\w{2})-(\d*\w{2}),.*/,"$1-$2");
  }else if(data ==='money'){
    return parseInt(string.replace(/.*\$(\d*)/,"$1")); // make it INT
  }
}
//Select Field and make an array of data
const actFieldChildren = $('.activities')[0].children
const actArray = [];
for(let i=1; i<actFieldChildren.length; i++){
  const string = actFieldChildren[i].textContent;
  actArray.push({
    name: actFieldChildren[i].firstChild.name,
    day: getData('day',string),
    time: getData('time',string),
    money: getData('money',string),
    index: i
  });
}

//Function that calculate total Cost
function totalMoney(){
  let totalMoney=0;
  for(let i =1; i< actFieldChildren.length; i++){
    if($(actFieldChildren[i].firstChild).prop('checked')){
      totalMoney += getData('money', actFieldChildren[i].textContent);
    }
  }
  return totalMoney;
}

//If there is any change on .activities Fieldset,
//1.It tracks which checkbox is checked and which is not
//2.Disable same time courses
//3.Show total cost under the checkboxes
$('.activities').change((e)=>{
  const isChecked = $(e.target).prop('checked');
  let disable;
  if(isChecked){
    disable = true;
  } else {
    disable = false;
  }
  const name = e.target.name;
  let day;
  let time;
  let money;
  for(let i =0; i<actArray.length; i++) {
    if(actArray[i].name === name) {
      day = actArray[i].day;
      time = actArray[i].time;
      money = actArray[i].money;
    }
  }
  for(let i=0; i<actArray.length; i++){
    if(actArray[i].name !== name){
      if(actArray[i].day=== day && actArray[i].time ===time){
        $(`input[name=${actArray[i].name}]`)[0].disabled = disable;
      }
    }
  }
  $('fieldset.activities label:last-child').text(`Total:$${totalMoney()}`);
});


//Payment information: only show selected option related informantion
$('select#payment option[value="select_method"]').prop("disabled",true);
$('select#payment option[value="credit-card"]').prop("selected",true);
function selectPayment(){
  const selectedPay = $('select#payment option:selected').val();
  function hideShowPayment(selectedPay){
    const elements =$(`select#payment option`);
    for(let i=1 ; i<elements.length; i++){
      if(elements[i].value===selectedPay){
        $(`div#${elements[i].value}`).show();
      } else {
        $(`div#${elements[i].value}`).hide();
      }
    }
  }
  hideShowPayment(selectedPay);

}
$('select#payment').change(selectPayment());
$('select#payment').ready(selectPayment());

//Form Validation

function validateName(){
  const nameInput = $('input#name');
  const isValidName = /.+/.test(nameInput.val());
  if(isValidName){
    nameInput.removeClass('error');
    return true;
  } else {
    nameInput.addClass('error');
    return false;
  }
}

function validateEmail(){
  const emailInput = $('input#mail');
  const isValidEmail = /^[^@]+@[^@.]+\.\w+$/.test(emailInput.val());
  if(isValidEmail){
    emailInput.removeClass('error');
    return true;
  } else {
    emailInput.addClass('error');
    return false;
  }
}

function validateActivities(){
  const checkboxes = $('.activities input[type="checkbox"]');
  const ischecked = checkboxes.is(":checked");
  if(ischecked) {
    checkboxes.parents('div.error-box').removeClass('error')
    return true;
  } else {
    checkboxes.parents('div.error-box').addClass('error');
    return false;
  }
}

function validateCreditCard(){
  const paymentValue = $('select#payment').val();
  if(paymentValue ==='credit-card'){
    const validateObj =[
      creditCard={
        selector:'#cc-num',
        regEx:/^\d{13,16}$/,
      },
      zip={
        selector:'#zip',
        regEx:/^\d{5}$/
      },
      cvv={
        selector:'#cvv',
        regEx:/^\d{3}$/
      }
    ]
    function validateCardInfo(obj){
      let boolean = true;
      obj.forEach((o)=>{
        const inputElement = $(o.selector);
        const isValidateInput = o.regEx.test(inputElement.val());
        if(isValidateInput){
          inputElement.removeClass('error');
          boolean *= true;
        } else {
          inputElement.addClass('error');
          boolean *= false;
        }
      });
      return boolean;
    }
    return validateCardInfo(validateObj);
  } else{
    return true;
  }
}
function addErrorLabel(){
  const arrayOfElement = [
    name={
      element:$('input#name'),
      message:"<label class='error-message'>Name field can't be blank.</label>"
    },
    email={
      element:$('input#mail'),
      message:"<label class='error-message'>Email field must be a validly formatted e-mail address.</label>"
    },
    activities={
      element:$('div#activities'),
      message:"<label class='error-message'>You must select at least one checkbox.</label>"
    },
    cc_num={
      element:$('input#cc-num'),
      message:"<label class='error-message'>Credit Card field should only accept a number between 13 and 16 digits.</label>",
      emptyMessage:"<label class='error-message'>It's Empty</label>"
    },
    zip={
      element:$('input#zip'),
      message:"<label class='error-message'>Zip Code field should be a 5-digit number.</label>",
      emptyMessage:"<label class='error-message'>It's Empty</label>"
    },
    cvv={
      element:$('input#cvv'),
      message:"<label class='error-message'>CVV should only be a number that is exactly 3 digits long.</label>",
      emptyMessage:"<label class='error-message'>It's Empty</label>"
    }
  ]
  arrayOfElement.forEach((ele)=>{
    if(ele.element.hasClass('error')){
      //Put some Empty message on Credit card information
      if(ele === cc_num || ele === zip || ele === cvv) {
        if(ele.element.val()){
          ele.element.after(ele.message);
        } else {
          ele.element.after(ele.emptyMessage);
        }
      } else {
        ele.element.after(ele.message);
      }
      ele.element.next().hide();
      // ele.element.hover((e)=>{
      //   ele.element.next('label.error-message').show();
      // },(e)=>{
      //   ele.element.next('label.error-message').hide();
      // });
      ele.element.focus((e)=>{
        ele.element.next('label.error-message').show();
      });
      ele.element.keyup((e)=>{
        ele.element.next('label.error-message').hide();
      });
      ele.element.focusout((e)=>{
        ele.element.next('label.error-message').hide();
      });
    } else {
      if(ele.element.siblings('label.error-message').text()){
        ele.element.siblings('label.error-message').remove()
      }
    }
  });

}
$('form[method]').submit(function(e){
  if(!(validateEmail()*validateName()*validateActivities()*validateCreditCard())){
    e.preventDefault();
    addErrorLabel();
  }
});

$('input').keyup(function(e){
  console.log('keyup event has occured!');
  if(!(validateEmail()*validateName()*validateActivities()*validateCreditCard())){
    e.preventDefault();
    addErrorLabel();
  }
});
