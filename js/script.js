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




/**
 * Form Validation part
 *
 */

const regExForId ={
  name:/.+/,
  mail:/^[^@]+@[^@.]+\.\w+$/,
  cc_num:/^\d{13,16}$/,
  zip:/^\d{5}$/,
  cvv:/^\d{3}$/
}
// changed mail regEx for 'real' real check
const regExForId_inRealTime = {
  name:/.+/,
  mail:/^[^@]+(@([^@.]+(\.(\w+)?)?)?)?$/, //justChanged(No error message if it's going alright)
  cc_num:/^\d{13,16}$/,
  zip:/^\d{5}$/,
  cvv:/^\d{3}$/
}

//errorMessage for error
const errorMessageForId ={
  name:"Name field can't be blank.",
  mail:"Email field must be a validly formatted e-mail address.",
  cc_num:"Credit Card field should only accept a number between 13 and 16 digits.",
  zip:"Zip Code field should be a 5-digit number.",
  cvv:"CVV should only be a number that is exactly 3 digits long."
}

//This validate 5 inputField(name, mail, cc-num, zip, cvv)
function inputValidate(inputId, regExForId){
  const inputElement = $(`input#${inputId}`);
  const isValidInput = regExForId[inputId].test(inputElement.val());
  if(isValidInput){
    inputElement.removeClass('error');
    return true;
  } else {
    inputElement.addClass('error');
    return false;
  }
}

//This validate whether user selected at least 1 checkbox on activities
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

//Function for show Error message next to the target element
function showErrorMessage(element, message){
  if(element.next('.error-message').text()){
    element.next('.error-message').show()
  } else {
    element.after(`<div class ='error-message'><span>${message}</span></div>`)
  }
}

//Function for hide Error message
function hideErrorMessage(element){
  if(element.next('.error-message').text()){
    element.next('.error-message').remove()
  }
}

//showErrorMessage + hideErrorMessage use function
function errorMessageShowHide(isValidInput, inputElement, errorMessage){
  hideErrorMessage(inputElement);//initialize
  if(!isValidInput){
    if(inputElement.val() ==='') {
      showErrorMessage(inputElement, "It's empty!")//If input val() is '' then print out "it's empty!" rather than default message saved on 'errorMessageForId' object
    } else {
    showErrorMessage(inputElement, errorMessage)
    }
  }
}

function inputValidateEventHandler(e) {
  const inputElement =$(e.target)
  const inputId = inputElement.attr('id');
  const errorMessage = errorMessageForId[inputId];
  const isValidInput = inputValidate(inputId, regExForId_inRealTime);
  errorMessageShowHide(isValidInput, inputElement, errorMessage);
}

function activitiesValidateEventHandler(){
  const isValidActivities = validateActivities();
  const activitiesElement =$('div#activities');
  const activitiesErrorMessage = "You must select at least one checkbox.";
  errorMessageShowHide(isValidActivities, activitiesElement, activitiesErrorMessage );
}


/**
 * Form Validation Event handler part
 *
 */
//Eventhandler for submit Event
$('form[method]').submit(function(e){
  let validateAllInput =1;
  //validate all input (5 input)
  for(let id in regExForId){
    validateAllInput *= inputValidate(id,regExForId);
  }
  //validate activities field
  const isValidActivities = validateActivities()
  if(!(validateAllInput*isValidActivities)){
    e.preventDefault();
    //Validate and show errormessage inputFieldes(5 input)
    const keyArray = Object.keys(regExForId);
    for(let i =0; i<keyArray.length; i++){
      const inputElement = $(`input#${keyArray[i]}`);
      const inputId = inputElement.attr('id');
      const errorMessage = errorMessageForId[inputId];
      const isValidInput = inputValidate(inputId, regExForId);
      errorMessageShowHide(isValidInput, inputElement, errorMessage);
    }
    //Validate and show errormessage activities field
    const activitiesElement =$('div#activities');
    const activitiesErrorMessage = "You must select at least one checkbox.";
    errorMessageShowHide(isValidActivities, activitiesElement, activitiesErrorMessage );
  }
});

//Eventhandler for keyup
$('input[type="text"]').keyup((e)=>{
  inputValidateEventHandler(e);
});

//Eventhandler for focus
$('input[type="text"]').focus((e)=>{
  inputValidateEventHandler(e);
});

//Eventhandler for focusout
$('input[type="text"]').focusout((e)=>{
  hideErrorMessage($(e.target));
});

//Eventhandler for hover
$('div#activities').hover(()=>{
  activitiesValidateEventHandler();
},
()=> {
  hideErrorMessage($('div#activities'));
});

//Eventhandler for click
$('input[type="checkbox"]').click(()=>{
  activitiesValidateEventHandler();
});
