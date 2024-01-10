const inputSlider=document.querySelector('[data-lengthSlider]');
const lengthDisplay=document.querySelector('[data-lengthNumber]');
const passwordDisplay=document.querySelector('[data-passwordDisplay]');
const copyBtn=document.querySelector('[data-copy]');
const copyMsg=document.querySelector('[data-copyMsg]');
const uppercaseCheck=document.querySelector('#uppercase');
const lowercaseCheck=document.querySelector('#lowercase');
const numbersCheck=document.querySelector('#numbers');
const symbolsCheck=document.querySelector('#symbols');
const indicator=document.querySelector('[data-indicator]');
const generateBtn=document.querySelector('.generate-password');
const allCheckBox=document.querySelectorAll("input[type=checkbox]");

//this is a string
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passswordLength=10;
let checkCount=0;
// set strength circle color to grey
setIndicator('#ccc');

handleSlider();

//set passwordlength
//iska itna he kaam tha ke passwodlength ko ui par display karvata hain
function handleSlider(){
    inputSlider.value=passswordLength;
    lengthDisplay.innerText=passswordLength;
    // yeh niche vale teen line se output nahe aa raha 
    // const min=inputSlider.min;
    // const max=inputSlider.max;
    // inputSlider.style.backgroundSize=(((passswordLength-min)*100)/(max-min))+ "% 100%";
}

function setIndicator(color)
{
    indicator.style.background=color;
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

function getRndIntegr(min,max)
{
    return Math.floor(Math.random()*(max-min)) +min;
}

function generateRandomNumber()
{
    return getRndIntegr(0,9);
}
function generateUppercase()
{
    return String.fromCharCode(getRndIntegr(65,91));
}
function generateLowercase()
{
    return String.fromCharCode(getRndIntegr(97,123));
}
function generateSymbol()
{
    let rndint=getRndIntegr(0,symbol.length);
    return symbol.charAt(rndint);
}
function calcStrength()
{
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked)
    {
        hasUpper=true;
    }
    if(lowercaseCheck.checked)
    {
        hasLower=true;
    } 
    if(numbersCheck.checked)
    {
        hasNum=true;
    }
    if(symbolsCheck.checked)
    {
        hasSym=true;
    }
    if(hasUpper && hasLower && (hasNum || hasSym) && passswordLength>=8)
    {
        setIndicator('#0f0');
    }
    else if((hasUpper||hasLower) && (hasNum || hasSym) && passswordLength>=6)
    {
        setIndicator('#ff0');
    }
    else
    {
        setIndicator('#f00');
    }

}


async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText='Copied';
    }
    catch(e)
    {
        copyMsg.innerText='Failed';
    }

    //to make copy vala span visible
    copyMsg.classList.add('active');

    setTimeout(()=>
    {
        copyMsg.classList.remove('active');
    },2000);
}

function handleCheckboxChange()
{
    checkCount=0;
    allCheckBox.forEach((checkbox)=>
    {
        if(checkbox.checked)
        checkCount++;
    });

    //special condition i.e corner case
    if(passswordLength<checkCount)
    {
        passswordLength=checkCount;
        handleSlider();
    }
   
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckboxChange);
    
})

// yeh samjh nahe aaya 
inputSlider.addEventListener('input',(e) =>{
    passswordLength=e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    {
        copyContent();
    }
})
function shufflePassword(array) {
    //Fisher yates mathod
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

generateBtn.addEventListener('click',()=>{

    //none of the checkbox are selected 
    if(checkCount==0)
    {
        return;
    }
    //special condition
    if(passswordLength<checkCount)
    {
        passswordLength=checkCount;
        handleSlider();
    }

    //let's start the journey to find new password

    //remove old password
    password="";
    
    let funcArr=[];
    if(uppercaseCheck.checked)
    funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
    funcArr.push(generateLowercase);

    if(numbersCheck.checked)
    funcArr.push(generateRandomNumber);
    
    if(symbolsCheck.checked)
    funcArr.push(generateSymbol);

    //compulsory condition
    for(let i=0; i<funcArr.length; i++)
    {
        password+=funcArr[i]();
    }
    //remaining addition
    for(let i=0; i<passswordLength-funcArr.length; i++)
    {
        let ranInt=getRndIntegr(0,funcArr.length);
        password+=funcArr[ranInt]();
    }
    //shuffle the password
    password=shufflePassword(Array.from(password));

    //show in UI
    passwordDisplay.value=password;

    //calculate strength
    calcStrength(); 



});

