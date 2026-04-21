import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CheckoutForm } from './CheckoutForm'

/**
 * Exercício 3 — CheckoutForm
 *
 * Nível de dificuldade: Misto
 * Alguns casos têm o render() ou parte da interação prontos.
 * Outros estão completamente em branco.
 *
 * Conceitos praticados:
 *  - getByLabelText / getByRole
 *  - userEvent.type() para preencher campos
 *  - Validação de formulário (erros)
 *  - toHaveBeenCalledWith() com dados do formulário
 *  - not.toHaveBeenCalled()
 */

describe('CheckoutForm', () => {
  it('renderiza todos os campos do formulário', () => {
    render(<CheckoutForm onSubmit={jest.fn()} />)

    // TODO: verifique que os campos Nome, E-mail e CEP estão presentes
    // Dica: use getByLabelText() buscando pelo texto de cada <label>
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/E-mail/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/CEP/i)).toBeInTheDocument()
  })

  it('exibe erro quando o nome está vazio ao tentar submeter', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    // TODO: verifique que a mensagem "Nome é obrigatório" está na tela
    expect(screen.getByText(/Nome é obrigatório/i)).toBeInTheDocument()
  })

  it('exibe erro quando o e-mail é inválido', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/Nome/i), 'João')
    await userEvent.type(screen.getByLabelText(/E-mail/i), 'nao-é-email')
    await userEvent.type(screen.getByLabelText(/CEP/i), '12345678')

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(screen.getByText(/E-mail inválido/i)).toBeInTheDocument()
  })

  it('exibe erro quando o CEP tem menos de 8 dígitos', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.type(screen.getByLabelText(/Nome/i), 'João')
    await userEvent.type(screen.getByLabelText(/E-mail/i), 'joao@email.com')
    await userEvent.type(screen.getByLabelText(/CEP/i), '1234')

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(screen.getByText(/CEP deve ter 8 dígitos/i)).toBeInTheDocument()
  })

  it('chama onSubmit com os dados corretos quando o formulário é válido', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    const nome = 'Maria'
    const email = 'maria@example.com'
    const cep = '01001000'

    await userEvent.type(screen.getByLabelText(/Nome/i), nome)
    await userEvent.type(screen.getByLabelText(/E-mail/i), email)
    await userEvent.type(screen.getByLabelText(/CEP/i), cep)

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    expect(onSubmit).toHaveBeenCalledWith({ nome, email, cep })
  })

  it('não chama onSubmit quando há erros de validação', async () => {
    const onSubmit = jest.fn()
    render(<CheckoutForm onSubmit={onSubmit} />)

    await userEvent.click(screen.getByRole('button', { name: /finalizar/i }))

    // TODO: verifique que onSubmit *não* foi chamado
    expect(onSubmit).not.toHaveBeenCalled()
  })
})
