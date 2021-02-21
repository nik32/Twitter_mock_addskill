//Defined here to save code as multiple components use loader
const loader = (show) => {
    const progress_bars = document.getElementsByClassName("progress");
    if(progress_bars){
        for(let progress_bar of progress_bars)
        progress_bar.style.display = show ? 'block' : 'none';//Note - Just toggle the display of the loader. Don't Rmove it from DOM. It will cause error when you will fetch pages 2 onwards as react won't call render() again. It will just update the state 
    }
}

export default loader;