jQuery(function ($) {
        $("#treeview").shieldTreeView({
            dragDrop: true,
            dragDropScope: "treeview-dd-scope",
            dataSource: {
                data: [
                    {
                        text: "Syllabus", expanded: true, iconCls: "fa fa-folder", items: [
                            {
                                text: "English", expanded: true, items: [
                                    { text: "English I" },
                                    { text: "English II" }
                                ]
                            },
                            {
                                text: "Maths", items: [
                                    { text: "Number System" }
                                ]
                            },
                            {
                                text: "Science", items: [
                                    { text: "Physics" },
                                    { text: "Chemistry" },
                                    { text: "Biology" }
                                ]
                            }
                        ]
                    },
                    {
                        text: "TheoreX", iconCls: "fa fa-book", expanded: true, items: new shield.DataSource({
                            data: [
                                { text: "C" },
                                { text: "Java" },
                                { text: "C++" },
                                { text: "Python", disabled: true }
                            ],
                            sort: { path: "text" }
                        }),
                        hasChildren: true
                    }
                ]
            },
            events: {
                droppableOver: function(e) {
                    if (!e.valid) {
                        // if an invalid draggable item is over a tree item,
                        // re-validate it - i.e. if it is a doc-item, allow the drop
                        if ($(e.draggable).hasClass('doc-item')) {
                            e.valid = true;
                        }
                    }
                },
                drop: function (e) {
                    var valid = e.valid;
                    if (!valid) {
                        // if not valid, it means something different than a tree node
                        // is being dropped - in this case, check for a doc item and 
                        // set valid to true if so
                        if ($(e.draggable).hasClass('doc-item')) {
                            valid = true;
                        }
                    }
                    if (valid) {
                        if (e.sourceNode) {
                            // dropping a treeview node - move it
                            this.append(e.sourceNode, e.targetNode);
                        }
                        else {
                            // dragging a doc item - insert a new one
                            // and remove the dragged element
                            this.append({ text: $(e.draggable).html() }, e.targetNode);
                            $(e.draggable).remove();
                        }
                        // disable the animation
                        e.skipAnimation = true;
                    }
                }
            }
        });
        // handle drop on the trash can
        $(".item-trash").shieldDroppable({
            scope: "treeview-dd-scope",
            hoverCls: "item-trash-dropover",
            tolerance: "touch",
            events: {
                drop: function (e) {
                    if ($(e.draggable).hasClass('sui-treeview-item-text')) {
                        // dropped a treeview item - delete it
                        $("#treeview").swidget("TreeView").remove($(e.draggable).closest('.sui-treeview-item'));
                    }
                    else {
                        // dropped a doc-item, just delete it from the DOM
                        $(e.draggable).remove();
                    }
                    // disable animation of the droppable, so that it
                    // does not get animated if cancelled
                    e.skipAnimation = true;
                }
            }
        });
    });