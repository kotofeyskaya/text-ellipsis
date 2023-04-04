import {ComponentProps} from 'react'
import {Meta, StoryFn} from '@storybook/react'
import TextEllipsis from '../components/TextEllipsis'

type TextEllipsisProps = {
    /**
     * Width of a demo container
     */
    containerWidth: number
} & ComponentProps<typeof TextEllipsis>

export default {
    title: 'TextEllipsis',
    component: TextEllipsis,
    argTypes: {
        containerWidth: {
            control: {
                type: 'range',
                min: 0,
                max: 1500,
                step: 5,
            },
        },
    },
} as Meta<typeof TextEllipsis>

const Template: StoryFn<TextEllipsisProps> = ({containerWidth, ...args}: TextEllipsisProps) => {
    return (
        <div style={{width: containerWidth}}>
            <TextEllipsis {...args} />
        </div>
    )
}
export const TextEllipsisStory = Template.bind({})
TextEllipsisStory.args = {
    containerWidth: 300,
    children: 'feature/create-new-text-ellipsis-component-TC2018.02',
    tailLength: 5,
    title: 'A new amazing feature!'
}

const DATA = Array(2000).fill(null).map((_, index) => `A long long long long long long looooooong text in a ${index} row`)

const TableTemplate: StoryFn<TextEllipsisProps> = (args) => {

    return (
        <table style={{
            borderCollapse: 'collapse',
            borderSpacing: 0,
            tableLayout: 'fixed',
            width: args.containerWidth ?? '100%'
        }}>
            <tbody>
                {DATA.map((value, index) => (
                <tr key={index}>
                    <td style={{border: '1px solid black', overflow: 'hidden'}}>
                        <TextEllipsis tailLength={args.tailLength}>{value}</TextEllipsis>
                    </td>
                    <td style={{border: '1px solid black', overflow: 'hidden'}}>
                        <TextEllipsis tailLength={args.tailLength}>{value}</TextEllipsis>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}
export const TextEllipsisTableStory = TableTemplate.bind({})
TextEllipsisTableStory.args = {
    tailLength: 5
}