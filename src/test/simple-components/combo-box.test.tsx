import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { ComboBox } from "@/shared/components/ui/combo-box"

const options = [
  { label: "Opción A", value: "a" },
  { label: "Opción B", value: "b" },
  { label: "Opción C", value: "c" },
]

describe("ComboBox", () => {
  it("muestra el defaultValue inicial y se actualiza al cambiar prop", async () => {
    const { rerender } = render(<ComboBox options={options} defaultValue="b" />)
    const button = screen.getByRole("button")
    expect(button).toHaveTextContent("Opción B")

    rerender(<ComboBox options={options} defaultValue="c" />)
    expect(button).toHaveTextContent("Opción C")
  })

  it("abre el dropdown, selecciona una opción y llama a onSelect", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()

    render(
      <ComboBox
        options={options}
        placeholder="Elige una"
        onSelect={onSelect}
      />,
    )

    const btn = screen.getByRole("button")
    expect(btn).toHaveTextContent("Elige una")
    await user.click(btn)
    for (const opt of options) {
      expect(screen.getByText(opt.label)).toBeInTheDocument()
    }

    await user.click(screen.getByText("Opción B"))
    expect(onSelect).toHaveBeenCalledWith("b")
    expect(btn).toHaveTextContent("Opción B")
  })
})
