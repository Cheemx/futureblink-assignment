import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    data: {
        label: {
            type: String,
            required: true
        },
    },
    position: {
        x: {
            type: Number,
            required: true
        },
        y: {
            type: Number,
            required: true
        },
    },
})

const EdgeSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    label: {
        type: String
    }
})

const FlowchartSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nodes: [NodeSchema],
    edges: [EdgeSchema]
}, {
    timestamps: true
})

export const Flowchart = mongoose.model("Flowchart", FlowchartSchema)