        <div class="container">
            <div class="row">
                <div class="offset4 span4 well well-small" id="status">
                    Connecting...
                </div>
            </div>
            <div id="serverStatus" style="display:none;">
                <div class="row">
                    <div class="span12">
                        <ul class="thumbnails">
                            <li class="span3 block">
                                <div class="thumbnail statusHeaders">
                                    <span class="statusMain" id="day"></span><span id="days-label" class="statusSecondary"></span>
                                    <div class="statusTime" id="uptime" ></div>
                                    <div class="statusHeadsBottom">
                                        Uptime
                                    </div>
                                </div>
                            </li>

                            <li class="span3">
                                <div class="thumbnail statusHeaders">
                                    <div id="cpuLoad"></div>
                                    <div class="statusHeadsBottom">
                                        CPU Load
                                    </div>
                                </div>
                            </li>

                            <li class="span3">
                                <div class="thumbnail statusHeaders statusGraphBox">
                                    <div id="memGraph" style="margin: 0 auto"></div>
                                    <div class="statusHeadsBottom">
                                        Memory
                                    </div>
                                </div>
                            </li>
                            <li class="span3">
                                <div class="thumbnail statusHeaders statusGraphBox">
                                    <div id="netGraph" style="margin: 0 auto"></div>
                                    <div class="statusHeadsBottom">
                                        Network
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="span6">
                        <table id="driveList" class="table table-hover table-bordered driveList table-condensed">
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                    <div class="span6">
                        <table id="portScan" class="table table-hover table-bordered portScan">
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

