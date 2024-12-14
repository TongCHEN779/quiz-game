var radios = document.getElementsByName('switch'); 

localStorage.setItem('switchQuestion', this.id);

for (i = 0; i < radios.length; i++) {
    radios[i].addEventListener('change', function() {
        localStorage.setItem('switchQuestion', this.id);
    });
}