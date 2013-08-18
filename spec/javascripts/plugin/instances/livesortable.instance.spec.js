describe("The stored LiveSortable instance", function() {
    beforeEach(function() {
        this.defineTestSuiteVariables();
    });

    it("should return true if the element that's being dragged", function() {
        this.$firstLi.simulate("dragStart", { dx: 10 });
        expect(this.liveSortable.isBeingDragged).toBeTruthy();

        this.$firstLi.simulate("dragEnd");
        expect(this.liveSortable.isBeingDragged).toBeFalsy();
    });

    it("should store the socket", function() {
       expect(this.liveSortable.getSocket()).toEqual(this.socketMock);      
    });

    it("should delete the plugin when remove is called", function() {
        this.liveSortable.remove();

        expect(this.getPluginInstance(this.$list)).not.toBeDefined();  
        expect(this.$list).not.toHandle("mousemove.liveSortable");
    });

    it("should have its methods accesible if a string is passed as argument", function() {
        spyOn(this.liveSortable, "remove");

        this.$list.liveSortable("remove", "argument1", "argument2");

        expect(this.liveSortable.remove).toHaveBeenCalledWith("argument1", "argument2");
    });

    it("should toggle the cancelRealtime option on toggleRealtime", function() {
        var spyMoveElementEvent = spyOnEvent(this.$list, "move_element.liveSortable");

        // By default the event is handled by the object, the first toggle disables it...
        this.toggleRealtime();
        expect(spyMoveElementEvent).not.toHaveBeenTriggered();

        //...the next reenables it
        this.toggleRealtime();
        expect(spyMoveElementEvent).toHaveBeenTriggered();
    });
    it("should toggle the cancelSedingInRealtime option on toggleRealtimeSending", function() {
        // By default the event is handled by the object, the first toggle disables it...
        this.toggleRealtimeSending();
        expect(this.socketMock.emit).not.wasCalledWith("broadcast_moving_element.liveSortable");

        //...the next reenables it
        this.toggleRealtimeSending();
        expect(this.socketMock.emit).wasCalledWith("broadcast_moving_element.liveSortable", this.pluginOptions.events.mousemove());
    });
});