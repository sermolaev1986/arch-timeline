package ru.arch_timeline.model;


public class ResultPage {

    public ResultPage(boolean last, ArchEvent[] events) {
        isLast = last;
        this.events = events;
    }

    private ArchEvent[] events;

    private boolean isLast;

    public ResultPage() {
    }

    public ArchEvent[] getEvents() {
        return events;
    }

    public boolean isLast() {
        return isLast;
    }
}
