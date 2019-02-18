import React, { Component } from 'react'
import { Button, Form, Message } from 'semantic-ui-react'
import { Redirect } from 'react-router-dom'
const AuthLogin = require('./components/auth')

const MessageExampleCompact = () => (
    <Message negative>
        <Message.Header>Você não conseguiu logar, né ;(</Message.Header>
        <p>Verifique seu E-mail e a sua Senha se está tudo certinho</p>
    </Message>
  )
   
class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isAuth: null,
            isError:null,
            loading: null
        }

        this.login = this.login.bind(this)
    }
    
    componentDidMount() {
       AuthLogin.onAuthStateChanged()
    }

    login() {
        this.setState({
            loading: true
       })

        const user = {
            uid: undefined,
            nome: undefined,
            sobrenome: undefined,
            email: this.refs.email.value,
            senha: this.refs.senha.value
        }
        
        const isVerify = AuthLogin.isAuth(user.email,user.senha)
        isVerify.then(res => {
            this.setState({
                 isError: res
            })
            if(res) {
                const uid = AuthLogin.idLogin()
                user.uid = uid
                AuthLogin.readDatabase(uid)
                .then(read => {
                    const dataUser = read.val()
                    user.nome = dataUser.nome
                    user.sobrenome = dataUser.sobrenome
                    localStorage.setItem('user',JSON.stringify(user))
                    setTimeout(() => {
                        this.setState({
                            isAuth: res
                       })
                    },1000)
                    window.location.reload()
                })
            }
        })
    }

    render() {
        if(this.state.isAuth) {
            return (<Redirect to='/appointmenthome'/ >)
        }
        return (
            <div>
                {this.state.isError === false ? <MessageExampleCompact/> : null  }
                <div className="divFormLogin">
                <Form loading={this.state.loading}>
                    <Form.Field>
                        <label>E-mail</label>
                        <input type='email' ref='email' autoFocus placeholder='E-mail'/>
                    </Form.Field>
                    <Form.Field>
                        <label>Senha</label>
                        <input type='password' ref='senha' placeholder='Senha' />
                    </Form.Field>
                        <Button inverted fluid color='blue' type='button' size='tiny' onClick={this.login}>LOGIN</Button>
                    </Form>
                </div>
            </div>
        )
    }
}

export default Login