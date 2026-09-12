import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CustomSelect from '@/components/base/CustomSelect.vue'

describe('CustomSelect', () => {
  const options = [
    { label: 'Option 1', value: 1 },
    { label: 'Option 2', value: 2 },
  ]
  let wrapper: any

  beforeEach(() => {
    wrapper = mount(CustomSelect, {
      props: {
        options,
        placeholder: 'Choose an option',
      },
    })
  })

  it('renders placeholder by default', () => {
    expect(wrapper.text()).toContain('Choose an option')
  })

  it('opens dropdown when clicked', async () => {
    expect(wrapper.find('[test-id="select-dropdown"]').exists()).toBe(false)

    await wrapper.find('[test-id="select-button"]').trigger('click')

    expect(wrapper.find('[test-id="select-dropdown"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Option 1')
  })

  it('emits update:modelValue when an option is selected', async () => {
    await wrapper.find('[test-id="select-button"]').trigger('click')

    const firstOption = wrapper.find('[test-id="select-option"]')
    await firstOption.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })
})
