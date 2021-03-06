import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Token extends React.Component {
    deleteToken() {
	this.props.deleteToken(this.props.data.text);
	console.log(this.props.data.text)
    }
    
    render() {
	return (
		<div className="token">
		<span>{this.props.data.text}</span>
		<span onClick={() => this.deleteToken()} >x</span>
		</div>
	);
    }
}

class InputBox extends React.Component {
    constructor(props) {
      super(props);
      this.state = { value: '' };
    }
    
    focusTextInput() {
	this.refs.emailInput.focus();
    }

    validateEmail(email) {
	if(email.length>0) {
	    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	} else {
	    return false;
	}
    }

    addToken(token) {
	console.log(token);
	this.props.addToken(token);
    }

    checkTokenRemoval() {
	if(this.state.value.length === 0) {
	    this.props.backToken();
	}
    }
    
    keyDown(event){
	switch(event.keyCode) {
	case 13: //enter
	case 32: //space
	case 188: //comma
            event.preventDefault();
            if(this.validateEmail(this.state.value)) {
		this.addToken(this.state.value);
            } else {
		alert('Invalid Email');
            }
            this.setState({value: ''});
	    break;
	case 8: //backspace
            this.checkTokenRemoval();
	    break;
	default:
            // console.log(event.keyCode);
	}
    }

    handleChange(event) {
	var v=event.target.value;
	var that=this;
	var x=(v.indexOf(' ')>=0 || v.indexOf(',')>=0);

	if(x==true) {
	    console.log(x);
	    var emails=v.split(/,| /);
	    var i;
	    for(i=0;i<emails.length;i++) {
		var isValid=this.validateEmail(emails[i]);
		console.log(this);
		console.log(emails[i]+' is valid:'+isValid);
		if(isValid===true) {
		    this.addToken(emails[i]);
		    console.log("Adding: "+emails[i]);
		}
	    }
	    this.setState({value: ''});
	    this.props.changeInputText('');
	} else {
	    this.setState({value: v});
	    this.props.changeInputText(v);
	}
    }
    
    render() {
	return (
		<div className='input-box'>
		<input ref='emailInput' type='text' value={this.state.value} onKeyDown={e => this.keyDown(e)} onChange={e => this.handleChange(e)}/>
		</div>
	);
    }
}

class Container extends React.Component {
    constructor(props) {
	super(props);
//	this.inputBox = null;
	this.state = { tokens: [], inputText:'' };
    }
    
    onClick() {
	console.log("Clicked on container");
	this.inputBox.focusTextInput();
    }

    onTokenAdded(token) {
	this.setState({ tokens: [...this.state.tokens, { text: token }] });
    }

    onTokenDelete = (token) => {
	var t=this.state.tokens.slice();
	var match=false;
	var i;
	for(i=0;i<t.length;i++) {
	    if(t[i].text==token) {
		match=i+1;
	    }
	}
	if(match) {
	    var to = this.state.tokens.filter(function(t) { return t.text != token });
	    this.setState({ tokens: to });
	}
    }
    
    onBackKey() {
    }
    
    onInputTextChange(text) {
	this.setState({ inputText: text });
	console.log(text);
    }
    
    render() {
	return (
		<div className='container' onClick={this.onClick}>
		{this.state.tokens.map(function(t) {
		    return <Token deleteToken={t => this.onTokenDelete(t)} key={t.text} data={t}/>;
		}.bind(this))}
		<InputBox ref={(ref) => this.inputBox = ref} changeInputText={t => this.onInputTextChange(t)} addToken={t => this.onTokenAdded(t)} backToken={this.onBackKey} />
		<div id='clear'/>
	    </div>
	);
    }
}

// ========================================

ReactDOM.render(
  <Container />,
  document.getElementById('root')
);
